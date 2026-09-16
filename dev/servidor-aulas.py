#!/usr/bin/env python3
"""Servidor local integrado para o portal e as disciplinas de graduacao."""

from __future__ import annotations

import argparse
import html
import mimetypes
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlsplit


SCRIPT_PATH = Path(__file__).resolve()
PORTAL_ROOT = SCRIPT_PATH.parents[1]
WORKSPACE_ROOT = PORTAL_ROOT.parent

PROJECT_NAMES = (
    "ia-aplicada-2026-02",
    "bd-2026-02",
    "arq-comp-so-2026-02",
)
PROJECTS = {name: WORKSPACE_ROOT / name for name in PROJECT_NAMES}

REMOTE_ASSETS = "https://pfransozi.github.io/assets/"
LOCAL_ASSETS = "/assets/"


def inside(path: Path, root: Path) -> bool:
    try:
        path.relative_to(root)
        return True
    except ValueError:
        return False


def dashboard() -> bytes:
    cards = []
    labels = {
        "ia-aplicada-2026-02": "Inteligencia Artificial Aplicada",
        "bd-2026-02": "Banco de Dados",
        "arq-comp-so-2026-02": "Arquitetura de Computadores e SO",
    }

    for slug, root in PROJECTS.items():
        available = root.is_dir()
        state = "disponivel" if available else "pasta nao encontrada"
        target = f"/{slug}/" if available else "#"
        disabled = "" if available else ' aria-disabled="true"'
        cards.append(
            f'<a class="card {"" if available else "missing"}" href="{target}"{disabled}>'
            f"<strong>{html.escape(labels[slug])}</strong>"
            f"<span>{html.escape(state)}</span></a>"
        )

    document = f"""<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Ambiente local das aulas</title>
  <style>
    :root {{ color-scheme: light dark; font-family: Inter, system-ui, sans-serif; }}
    body {{ margin: 0; min-height: 100vh; display: grid; place-items: center; background: #f5f5f5; color: #161616; }}
    main {{ width: min(920px, calc(100% - 32px)); padding: 48px 0; }}
    h1 {{ margin: 0 0 8px; font-size: clamp(2rem, 5vw, 3.6rem); font-weight: 500; letter-spacing: -.045em; }}
    p {{ margin: 0 0 32px; color: #666; }}
    .grid {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; }}
    .card {{ min-height: 120px; display: flex; flex-direction: column; justify-content: space-between; padding: 20px; border: 1px solid #d7d7d7; border-radius: 12px; background: #fff; color: inherit; text-decoration: none; }}
    .card:hover {{ border-color: #b509ac; }}
    .card span {{ color: #777; font-size: .86rem; }}
    .card.missing {{ opacity: .48; pointer-events: none; }}
    code {{ padding: 2px 5px; border-radius: 4px; background: #eee; }}
    @media (prefers-color-scheme: dark) {{
      body {{ background: #1c1c1d; color: #e8e8e8; }}
      p, .card span {{ color: #aaa; }}
      .card {{ border-color: #424246; background: #212529; }}
      .card:hover {{ border-color: #2698ba; }}
      code {{ background: #2c3237; }}
    }}
  </style>
</head>
<body>
  <main>
    <h1>Ambiente local das aulas</h1>
    <p>Os recursos compartilhados sao servidos da copia local. Edite os arquivos e recarregue a pagina com <code>Ctrl+F5</code>.</p>
    <div class="grid">{"".join(cards)}</div>
  </main>
</body>
</html>"""
    return document.encode("utf-8")


class TeachingHandler(SimpleHTTPRequestHandler):
    server_version = "AulasLocal/1.0"

    def do_GET(self) -> None:  # noqa: N802
        request_path = unquote(urlsplit(self.path).path)

        if request_path == "/":
            self.send_bytes(dashboard(), "text/html; charset=utf-8")
            return

        resolved = self.resolve_request(request_path)
        if resolved is None:
            self.send_error(HTTPStatus.NOT_FOUND, "Projeto ou arquivo nao encontrado")
            return

        root, file_path = resolved
        if file_path.is_dir():
            if not request_path.endswith("/"):
                self.send_response(HTTPStatus.MOVED_PERMANENTLY)
                self.send_header("Location", request_path + "/")
                self.end_headers()
                return
            file_path = file_path / "index.html"

        file_path = file_path.resolve()
        if not inside(file_path, root.resolve()) or not file_path.is_file():
            self.send_error(HTTPStatus.NOT_FOUND, "Arquivo nao encontrado")
            return

        content_type = mimetypes.guess_type(file_path.name)[0] or "application/octet-stream"
        data = file_path.read_bytes()

        if content_type == "text/html":
            text = data.decode("utf-8")
            text = text.replace(REMOTE_ASSETS, LOCAL_ASSETS)
            data = text.encode("utf-8")
            content_type = "text/html; charset=utf-8"
        elif content_type in {"text/css", "application/javascript", "text/javascript"}:
            content_type += "; charset=utf-8"

        self.send_bytes(data, content_type)

    def resolve_request(self, request_path: str) -> tuple[Path, Path] | None:
        parts = [part for part in request_path.split("/") if part]
        if not parts:
            return None

        if parts[0] == "assets":
            root = PORTAL_ROOT / "assets"
            relative = Path(*parts[1:]) if len(parts) > 1 else Path()
            return root, root / relative

        project = PROJECTS.get(parts[0])
        if project is None or not project.is_dir():
            return None

        relative = Path(*parts[1:]) if len(parts) > 1 else Path()
        return project, project / relative

    def send_bytes(self, data: bytes, content_type: str) -> None:
        self.send_response(HTTPStatus.OK)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(data)))
        self.send_header("Cache-Control", "no-store, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.end_headers()
        self.wfile.write(data)

    def end_headers(self) -> None:
        self.send_header("X-Content-Type-Options", "nosniff")
        super().end_headers()


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--host", default="127.0.0.1", help="Endereco de escuta")
    parser.add_argument("--port", type=int, default=8000, help="Porta HTTP")
    parser.add_argument(
        "--workspace",
        type=Path,
        default=WORKSPACE_ROOT,
        help="Pasta que contem os tres repositorios das disciplinas",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    workspace = args.workspace.expanduser().resolve()
    PROJECTS.clear()
    PROJECTS.update({name: workspace / name for name in PROJECT_NAMES})

    missing = [str(path) for path in PROJECTS.values() if not path.is_dir()]
    if missing:
        print("Aviso: alguns projetos nao foram encontrados como pastas irmas:")
        for path in missing:
            print(f"  - {path}")

    server = ThreadingHTTPServer((args.host, args.port), TeachingHandler)
    print(f"Ambiente local: http://{args.host}:{args.port}/")
    print("Pressione Ctrl+C para encerrar.")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServidor encerrado.")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
