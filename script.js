function calcular() {
  const D = parseFloat(document.getElementById("diametro").value);
  const C = parseFloat(document.getElementById("coeficiente").value);
  const Q = parseFloat(document.getElementById("caudal").value);
  const L = parseFloat(document.getElementById("longitud").value);

  const hf = 10.67 * (L / (Math.pow(C, 1.852) * Math.pow(D, 4.87))) * Math.pow(Q, 1.852);
  
  document.getElementById("resultado").innerText = `Pérdida de carga: ${hf.toFixed(3)} m`;
}
