const body = document.querySelector("body"),
      nav = document.querySelector("nav"),
      modeToggle = document.querySelector(".dark-light"),
      searchToggle = document.querySelector(".searchToggle"),
      sidebarOpen = document.querySelector(".sidebarOpen"),
      sidebarClose = document.querySelector(".sidebarClose");
      
      const search = document.querySelector('.input-group input'),
      table_rows = document.querySelectorAll('tbody tr'),
      table_headings = document.querySelectorAll('thead th');

      let getMode = localStorage.getItem("mode");
      if (getMode && getMode === "dark-mode") {
          document.body.classList.add("dark");
      }
      

    modeToggle.addEventListener("click", () => {
        modeToggle.classList.toggle("active");
        body.classList.toggle("dark");

        if(!body.classList.contains("dark")){
            localStorage.setItem("mode", "light-mode");
        } else {
            localStorage.setItem("mode", "dark-mode");
        }
     })
    
    searchToggle.addEventListener("click", () => {
        searchToggle.classList.toggle("active");
    })

    sidebarOpen.addEventListener("click", () => {
        nav.classList.add("active");
    })
    body.addEventListener("click", e => {
        let clickedElm = e.target;
        
        if(!clickedElm.classList.contains("sidebarOpen") && !clickedElm.classList.contains("menu")){
            nav.classList.remove("active");
        }
    })


    function solveTriangle() {
        let a = parseFloat(document.getElementById('sideA').value);
        let b = parseFloat(document.getElementById('sideB').value);
        let c = parseFloat(document.getElementById('sideC').value);
        let A = parseFloat(document.getElementById('angleA').value);
        let B = parseFloat(document.getElementById('angleB').value);
        let C = parseFloat(document.getElementById('angleC').value);
      
        const lados = [a, b, c].filter(x => !isNaN(x)).length;
        const angulos = [A, B, C].filter(x => !isNaN(x)).length;
      
        if (lados === 2 && angulos === 1) {
          resolverDosLadosUnAngulo(a, b, c, A, B, C);
        } else if (lados === 1 && angulos === 2) {
          resolverUnLadoDosAngulos(a, b, c, A, B, C);
        } else {
          mostrarResultados("Please input exactly 2 sides and 1 angle, or 2 angles and 1 side.");
        }
      }
      
      function resolverUnLadoDosAngulos(a, b, c, A, B, C) {
        if (isNaN(A)) A = 180 - B - C;
        if (isNaN(B)) B = 180 - A - C;
        if (isNaN(C)) C = 180 - A - B;
      
        if (Math.abs(A + B + C - 180) > 0.01) {
          mostrarResultados("The angles must add up to 180°.");
          return;
        }
      
        if (!isNaN(a)) {
          b = a * Math.sin(B * Math.PI/180) / Math.sin(A * Math.PI/180);
          c = a * Math.sin(C * Math.PI/180) / Math.sin(A * Math.PI/180);
        } else if (!isNaN(b)) {
          a = b * Math.sin(A * Math.PI/180) / Math.sin(B * Math.PI/180);
          c = b * Math.sin(C * Math.PI/180) / Math.sin(B * Math.PI/180);
        } else if (!isNaN(c)) {
          a = c * Math.sin(A * Math.PI/180) / Math.sin(C * Math.PI/180);
          b = c * Math.sin(B * Math.PI/180) / Math.sin(C * Math.PI/180);
        }
      
        mostrarResultados(formatResults(a, b, c, A, B, C));
      }
      
      function resolverDosLadosUnAngulo(a, b, c, A, B, C) {
        let knownAngle = null;
        let knownAngleValue = null;
      
        if (!isNaN(A)) { knownAngle = 'A'; knownAngleValue = A; }
        else if (!isNaN(B)) { knownAngle = 'B'; knownAngleValue = B; }
        else if (!isNaN(C)) { knownAngle = 'C'; knownAngleValue = C; }
      
        if (knownAngleValue === 90) {
          if (knownAngle === 'A') c = Math.sqrt(a * a + b * b);
          else if (knownAngle === 'B') a = Math.sqrt(b * b + c * c);
          else if (knownAngle === 'C') b = Math.sqrt(a * a + c * c);
      
          if (knownAngle === 'A') {
            B = Math.asin(b / c) * (180 / Math.PI);
            C = 90 - B;
          } else if (knownAngle === 'B') {
            A = Math.asin(a / c) * (180 / Math.PI);
            C = 90 - A;
          } else if (knownAngle === 'C') {
            A = Math.asin(a / b) * (180 / Math.PI);
            B = 90 - A;
          }
      
          mostrarResultados(formatResults(a, b, c, A, B, C));
          return;
        }
      
        if (knownAngle === 'A' && !isNaN(a) && !isNaN(b)) {
          B = Math.asin(b * Math.sin(A * Math.PI/180) / a) * 180/Math.PI;
          C = 180 - A - B;
          c = (a * Math.sin(C * Math.PI/180)) / Math.sin(A * Math.PI/180);
        } else if (knownAngle === 'B' && !isNaN(b) && !isNaN(c)) {
          C = Math.asin(c * Math.sin(B * Math.PI/180) / b) * 180/Math.PI;
          A = 180 - B - C;
          a = (b * Math.sin(A * Math.PI/180)) / Math.sin(B * Math.PI/180);
        } else if (knownAngle === 'C' && !isNaN(c) && !isNaN(a)) {
          A = Math.asin(a * Math.sin(C * Math.PI/180) / c) * 180/Math.PI;
          B = 180 - A - C;
          b = (c * Math.sin(B * Math.PI/180)) / Math.sin(C * Math.PI/180);
        } else {
          mostrarResultados("The known angle must be opposite a known side.");
          return;
        }
      
        mostrarResultados(formatResults(a, b, c, A, B, C));
      }
      
      function mostrarResultados(texto) {
        document.getElementById('results').innerText = texto;
        const values = texto.match(/[\d.]+/g);
        if (values && values.length === 6) {
          const [a, b, c, A, B, C] = values.map(Number);
          dibujarTriangulo(a, b, c, A, B, C);
        }
      }
      
      function formatResults(a, b, c, A, B, C) {
        return `
      Side A: ${a.toFixed(2)}
      Side B: ${b.toFixed(2)}
      Side C: ${c.toFixed(2)}
      Angle A: ${A.toFixed(2)}°
      Angle B: ${B.toFixed(2)}°
      Angle C: ${C.toFixed(2)}°`;
      }
      
      function dibujarTriangulo(a, b, c, A, B, C) {
        const canvas = document.getElementById('triangleCanvas');
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      
        const escala = 50;
        const offsetX = 50;
        const offsetY = 300;
      
        const Ax = 0, Ay = 0;
        const Bx = c * escala, By = 0;
      
        const Cx = a * escala * Math.cos(C * Math.PI / 180);
        const Cy = -a * escala * Math.sin(C * Math.PI / 180);
      
        ctx.fillStyle = "blue";
        ctx.font = "12px Arial";
        ctx.fillText(`c=${c.toFixed(2)}`, (Ax + Bx) / 2 + offsetX - 10, (Ay + By) / 2 + offsetY - 10);
        ctx.fillText(`a=${a.toFixed(2)}`, (Bx + Cx) / 2 + offsetX, (By + Cy) / 2 + offsetY);
        ctx.fillText(`b=${b.toFixed(2)}`, (Cx + Ax) / 2 + offsetX - 20, (Cy + Ay) / 2 + offsetY);

        ctx.beginPath();
        ctx.moveTo(Ax + offsetX, Ay + offsetY);
        ctx.lineTo(Bx + offsetX, By + offsetY);
        ctx.lineTo(Cx + offsetX, Cy + offsetY);
        ctx.closePath();
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = "#aaddff44";
        ctx.fill();
      
        if (Math.round(A) === 90) {
          ctx.beginPath();
          ctx.moveTo(Ax + offsetX, Ay + offsetY);
          ctx.lineTo(Ax + offsetX + 20, Ay + offsetY);
          ctx.lineTo(Ax + offsetX + 20, Ay + offsetY - 20);
          ctx.lineTo(Ax + offsetX, Ay + offsetY - 20);
          ctx.closePath();
          ctx.fillStyle = "red";
          ctx.fill();
        }
      
        ctx.fillStyle = "black";
        ctx.font = "14px Arial";
        ctx.fillText("A", Ax + offsetX - 10, Ay + offsetY + 15);
        ctx.fillText("B", Bx + offsetX + 5, By + offsetY + 15);
        ctx.fillText("C", Cx + offsetX, Cy + offsetY - 10);
      }
      