---
layout: post
title: "PATH hijacking no Linux: sudo, PATH e root"
date: 2025-11-30
description: "Um resumo de como um simples PATH hijacking no Linux pode render acesso root e como evitar esse tipo de falha em ambientes de produção."
categories: [cibersegurança, linux, lab-thm]
tags: [linux, privilege-escalation, sudo, path-hijacking, mitre-attck]
toc: true
---

## Introdução

Recentemente eu fiz o lab **Eavesdropper – Find the Flag**, no TryHackMe. À primeira vista, parecia “só mais um” desafio de escalonamento de privilégios em Linux. Na prática, ele acabou virando uma aula muito concreta sobre:

* Como o `PATH` pode ser abusado para rodar binários falsos.
* Como isso se conecta ao `sudo`.
* E, mais importante: como evitar esse tipo de ataque em ambientes de produção.

Neste post vou contar rapidamente como funciona o ataque (sem código malicioso passo a passo) e, principalmente, quais são as boas práticas para se proteger desse tipo de vetor.

---

## Cenário do lab (versão resumida)

No lab, eu tinha acesso SSH como um usuário comum, `frank`. O objetivo era, claro, virar `root`. Passos principais que fiz:

1. Usei uma ferramenta de monitoramento de processos (`pspy`) para observar o que o sistema estava executando em background.
2. Em determinado momento aparecia algo como:

```bash
UID=0 | sudo cat /etc/shadow
```

Ou seja: algum processo estava chamando `sudo` para ler `/etc/shadow`.

A partir daí, a ideia do lab era: se alguém está chamando `sudo` em um contexto onde o ambiente do usuário conta, dá pra enganar o sistema fazendo `sudo` apontar para outra coisa. Isso nos leva ao coração do ataque: PATH hijacking.

## Entendendo o PATH hijacking

No Linux, quando você digita um comando como:

```bash
    sudo id
```

O shell não “nasce sabendo” onde está `sudo`. Ele procura o binário percorrendo os diretórios definidos na variável de ambiente `PATH`, na ordem:

```bash
    echo $PATH
    # Exemplo típico:
    /usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:...
```

A lógica é:

1. Procura sudo em `/usr/local/sbin`.
2. Se não achar, tenta `/usr/local/bin`.
3. Depois `/usr/sbin`.
4. Depois `/usr/bin`.

E assim por diante. Se eu conseguir colocar um diretório escrevível por mim (como `/tmp` ou `~/bin`) no início do PATH, e criar um arquivo executável chamado sudo ali dentro, o shell passa a encontrar o meu sudo falso antes do `/usr/bin/sudo` legítimo. Exemplo conceitual:

``` bash
# (conceito) Colocar /tmp no começo do PATH
export PATH=/tmp:$PATH
# Agora, se existir /tmp/sudo e ele for executável:
which sudo
# /tmp/sudo
```

Isso é PATH hijacking. No lab, o “pulo do gato” foi justamente: ajustar o `PATH` no arquivo `~/.bashrc`. Isso era preciso porque o "gatilho" do comando `sudo /etc/shadow` era no momento do login. E foi preciso garantir que a linha estivesse no fim do arquivo `~/.bashrc` e viesse antes do PATH original. Assim, toda nova sessão `bash` do usuário já nascia com `/tmp` na frente – e qualquer `sudo` digitado naquela sessão cairia no binário falso.

## Onde isso vira ataque de verdade?

Se eu consigo:

1. Fazer o usuário (ou algum script) executar sudo sem caminho absoluto (apenas `sudo`, não `/usr/bin/sudo`).
2. Num contexto onde o `PATH` é controlável.
3. E colocar um binário/script falso chamado `sudo` à frente do `/usr/bin`.

Então eu posso:

1. Executar qualquer coisa no lugar do `sudo` real.
2. E potencialmente roubar credenciais (por exemplo, pedindo a senha e guardando em algum lugar antes de repassar para o `/usr/bin/sudo` verdadeiro).

Essa é a parte que, em ambiente real, vira uma técnica de **Credential Access** / **Privilege Escalation**. No lab, o objetivo era justamente explorar esse comportamento para capturar a senha e escalar para `root`. Em ambiente de produção, esse mesmo padrão é um incidente de segurança grave.

No caso específico no lab, o mais curioso é que **não era um usuário humano digitando `sudo` e a senha no terminal**. Quem estava rodando `sudo cat /etc/shadow` era **um serviço/script automatizado**, em background, em um contexto de maior privilégio.

Ou seja:

* Um processo legítimo chamava `sudo` sem caminho absoluto (`sudo ...`, e não `/usr/bin/sudo ...`).
* Esse processo rodava com privilégios elevados ou com regras de `sudo` permissivas.
* O meu `sudo` falso, em `/tmp`, era encontrado primeiro por causa do `PATH`.

Em muitos exemplos de PATH hijacking a narrativa é “roubei a senha que o usuário digitou no prompt do sudo”. Neste lab, o cenário é mais sutil (e mais próximo de ambientes reais):

* É um **serviço de sistema**, com um fluxo automatizado.
* Que chama `sudo` como parte de uma rotina de iníco de sessão.
* E acaba sendo desviado para um binário malicioso por causa do `PATH`.

O impacto é o mesmo (ou até pior): **execução de código no contexto do serviço**, potencialmente com privilégios altos, sem depender de nenhuma interação do usuário na frente do teclado.

## Conectando com o MITRE ATT&CK

Se olharmos esse lab com a lente do MITRE ATT&CK, dá pra mapear bem o que está acontecendo e, principalmente, o papel das automações que abusam de sudo, não só do usuário na frente do terminal.

Táticas envolvidas:

* **Privilege Escalation** (TA0004) – sair de usuário comum (`frank`) para `root`.
* **Credential Access** (TA0006) – porque o alvo intermediário é ler `/etc/shadow` e potencialmente quebrar senhas depois.

### `PATH` hijacking (T1574.007):  `Path` Interception by `PATH` Environment Variable

A técnica de colocar `/tmp` na frente do `PATH` e criar um `sudo` falso se encaixa em: 

``` text
T1574.007 – Hijack Execution Flow: Path Interception by PATH Environment Variable
```

Pontos em comum:

* Manipular a variável PATH.
* Colocar um binário malicioso antes do binário legítimo.
* Deixar o sistema chamar o executável “errado” quando alguém digita um comando sem caminho absoluto.

No lab, isso acontece quando:

* Adiciono `export PATH=/tmp:$PATH` no arquivo do `~/.bashrc`, que será carregado em cada nova sessão.
* Crio um `/tmp/sudo` malicioso.
* Deixo que um processo automatizado rode `sudo` sem especificar `/usr/bin/sudo`.

Aqui o ponto não é só “enganar o usuário”, mas enganar o próprio serviço: o fluxo de execução do serviço é sequestrado via PATH hijacking.

### Abuso do `sudo` → T1548.003 – Sudo and Sudo Caching

A outra peça é o uso (ou abuso) do `sudo` como mecanismo de elevação de privilégio dentro de scripts/serviços:

``` text
T1548.003 – Abuse Elevation Control Mechanism: Sudo and Sudo Caching
```
No fluxo do lab:

* Um processo legítimo chama `sudo cat /etc/shadow`.
* Eu interfiro nesse fluxo com um `sudo` falso.
* A automação confia que `sudo` é o binário legítimo e que o ambiente está “limpo”.
* A partir daí, eu executo o que quiser no contexto daquele serviço (e/ou uso a credencial para obter root).

Esse é exatamente o tipo de cenário descrito no ATT&CK quando fala de:

* Scripts e jobs que dependem de sudo para subir privilégio.
* Regras de `sudoers` permissivas (`NOPASSWD`, comandos muito amplos).
* Cadeias de automação que confiam demais em `sudo` sem controlar ambiente e caminhos.

### Leitura de /etc/shadow → T1003.008 – /etc/passwd and /etc/shadow

O comando visto no pspy não é qualquer coisa, é:

``` bash
sudo cat /etc/shadow
```

Isso entra em:

```text
T1003.008 – OS Credential Dumping: /etc/passwd and /etc/shadow
```

O objetivo clássico:

* Ler `/etc/passwd` e `/etc/shadow`.
* Fazer dump de hashes de senha.
* Permitir quebra offline com ferramentas como John the Ripper ou Hashcat.

No lab, eu uso isso como parte de um cenário de escalonamento de privilégios. Na vida real, isso vira ponto de partida para:

* Account takeover.
* Movimento lateral.
* Criação de novas contas com privilégios elevados.

### Por que isso importa pra defesa?

Olhar para o lab via MITRE ATT&CK ajuda a transformar: “Ganhei root e peguei a flag” em:

* Técnicas mapeadas, com nomes e IDs.
* Pontos de detecção (onde você liga alertas).
* Pontos de mitigação (onde você faz hardening).

Por exemplo:

*  Para T1574.007 (`PATH` hijack):
    * Monitorar alterações suspeitas em `PATH`.
    * Monitorar criação de binários como `sudo`, `ssh`, `passwd` em diretórios de usuário ou em `/tmp`.
* Para T1548.003 (`sudo` abuse)
    * Auditar o `/etc/sudoers`.
    * Reduzir comandos liberados via `sudo`.
    * Registrar comandos `sudo` junto com usuário, TTY, host.
* Para T1003.008 ({ })
    * Alertar sempre que `/etc/shadow` for acessado fora de contextos esperados
    * Usar auditd/EDR para ver quem está lendo esse arquivo e como.

## Como impedir isso em ambientes de produção

### Nunca coloque diretórios escrevíveis no `PATH` (tipo `/tmp`)
Isso vale tanto para usuários comuns quanto, principalmente, para `root`. 
* Nunca deixe `/tmp`, `/var/tmp` ou qualquer diretório globalmente escrevível (`drwxrwxrwt`) no `PATH`. 
* Evite também colocar diretórios do usuário (`~/bin`, `~/.local/bin`) no `PATH` do `root`.

Se algum script fizer isso, o risco de PATH hijack sobe muito: qualquer usuário que tiver permissão de escrita ali pode “injetar” binários falsos.

### Em scripts privilegiados, use caminhos absolutos

Em scripts que rodam como `root` (`cron`, `systemd`, scripts de provisionamento etc.), não confie no `PATH`. Use sempre caminhos absolutos:

``` bash
# Em vez de:
sudo cat /etc/shadow
service ssh status
```

``` bash
# Use:
/usr/bin/sudo /bin/cat /etc/shadow
/usr/sbin/service ssh status
```

Isso elimina a possibilidade de PATH hijack nesses pontos: mesmo que alguém consiga mexer no `PATH`, o comando chamado será o específico `/usr/bin/sudo`, e não “qualquer coisa chamada sudo”.

### Hardening do sudoers (e usar secure_path)

No `/etc/sudoers`, existe a opção `secure_path` que define um `PATH` “forçado” para comandos executados via `sudo`, por exemplo:

``` bash
Defaults secure_path="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
```
Isso faz com que, quando alguém roda `sudo` comando, o `PATH` usado seja um conjunto de caminhos “limpos”, ignorando `PATH` adulterados no ambiente do usuário.

Outras boas práticas no sudoers:

* Limitar o uso de NOPASSWD só ao estritamente necessário.
* Evitar comandos genéricos demais (tipo ALL).
* Revisar regularmente quem pode usar sudo e para quê.

### Monitorar scripts de login e variáveis de ambiente

Pontos a revisar periodicamente:

Arquivos globais:
* `/etc/profile`.
* `/etc/bash.bashrc`.
* `/etc/zprofile`, `/etc/zshrc` (se usar zsh).

Arquivos por usuário:
* `~/.profile`.
* `~/.bash_profile`.
* `~/.bashrc`.
* `~/.zshrc`.

Procure por:

* Linhas que alterem `PATH` de forma suspeita (`PATH=...`, `export PATH=...`).
* Inclusão de diretórios incomuns no começo do `PATH`.
* Comandos que modifiquem `PATH` de forma dinâmica

Ferramentas de integridade (tipo AIDE, Tripwire) também podem ajudar a detectar mudanças inesperadas nesses arquivos.

### Auditar binários em diretórios “estranhos”

De tempos em tempos, é útil varrer:

* `/tmp`.
* `/var/tmp`.
* Diretórios como `~/bin`, `~/.local/bin`.

Em busca de:
* Arquivos executáveis com nomes “sensíveis”: `sudo`, `ssh`, `passwd`, `login`, entre outros.
* Scripts com conteúdo suspeito (captura de senha, logs estranhos, exfiltração).

Alguns comandos simples, já ajudam a pegar coisas óbvias:

```bash
find /tmp  -maxdepth 2 -type f -perm -111
```

```bash
find /home -maxdepth 3 -type f -perm -111 -name 'sudo'
```

### Usar ferramentas tipo pspy também no Blue Team

No lab, eu usei pspy para enxergar processos e encontrar oportunidades de ataque. Mas a mesma ideia funciona ao contrário:

Em uma investigação forense ou um hunting pontual, rodar algo no estilo pspy ajuda a identificar:

* scripts inesperados
* comandos `sudo` rodando em horários estranhos
* processos acessando `/etc/shadow`, `/etc/passwd` ou outros arquivos sensíveis

Claro: em produção, isso precisa ser feito com cuidado (carga, privacidade etc.), mas a ideia é válida.

### Checklist rápido de hardening para automações com sudo

Se você tem cron, systemd, scripts de manutenção, pipelines de CI/CD ou qualquer automação que roda com privilégios, vale passar por esse checklist:

1. Seu script realmente precisa de `sudo`?
    * Sempre que possível:
        * Execute o script diretamente como `root` (via systemd com User=/Group= bem definidos).
        * Ou separe a parte privilegiada em um serviço dedicado, em vez de sair espalhando `sudo` dentro de scripts.
    * Regra de bolso: “`sudo` é interface pra humano, não pra script”. Se o script precisa de `root`, pense em rodá-lo no contexto certo desde o início.
2. Se precisar usar sudo, use caminho absoluto:
    * Dentro de scripts:

        ``` bash
        # Evite:
        sudo comando
        sudo cat /etc/shadow
        ```

        ``` bash
        # Prefira:
        /usr/bin/sudo /bin/comando
        /usr/bin/sudo /bin/cat /etc/shadow
        ```

        Mesma lógica para os binários chamados pelo sudo (`/bin/cat`, `/usr/sbin/service`).
3. Trate o `PATH` como superfície de ataque:
    * Em scripts privilegiados, defina um PATH mínimo, controlado:

        ``` bash
        PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
        export PATH
        ```

    * Não herde PATH do ambiente do usuário sem pensar.
    * Nunca inclua diretórios escrevíveis por usuários (`/tmp`, `/var/tmp`, diretórios de home) no `PATH` de automações privilegiadas.
4. Revise o sudoers pensando em automações:
     * Use visudo e confira:
        * Regras com NOPASSWD: são realmente necessárias? Podem ser mais específicas?
        * Comandos permitidos: evite ALL, prefira linhas do tipo:

            ``` bash
            meu-user ALL=(root) NOPASSWD: /usr/bin/systemctl restart meu-servico
            ```

    * Avalie se o serviço não deveria rodar como root direto, em vez de usar sudo por baixo do pano.
    * Ative e use `secure_path` no sudoers:

        ``` bash
        Defaults secure_path="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
        ```

    Assim, mesmo quando scripts chamam sudo, o comando rodará com um PATH limpo.

## Conclusão

No fim das contas, esse lab não foi só sobre “pegar root”. Ele funcionou quase como um raio-x de algo que a gente costuma ignorar: detalhes de ambiente, `PATH` solto demais, `sudo` em automações e aquele “depois eu arrumo” que vai ficando pra depois.

O cenário é bem simples: um usuário comum, um serviço rodando em segundo plano, um `sudo` sem caminho absoluto e um `PATH` ajustado no lugar “certo”. Nada de exploit mirabolante, nada de zero-day — só a combinação de conveniência + descuido.

A moral da história não é “nunca use sudo” ou “automatização é ruim”, mas sim:

* se o seu script precisa mesmo de privilégio, dê esse privilégio de forma explícita e controlada;
* trate `PATH`, `sudoers` e scripts de login como superfície de ataque, não só como “configuração de conforto”.
