/* ./js/ui/components/playgournd.js*/

function runCode() {
  const code = document.getElementById('code-input').value;
  const outputFrame = document.getElementById('output');
  outputFrame.srcdoc = code;
}