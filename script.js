const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzP4bT8hhBMEVtj2hVIvvhU4aBqaw9c0DuLQ8XWNpjxWSuwp8UPnsONR2BaGbVuMiuCMg/exec";

let yaAbrio = false;

function cargarVIP() {
    const params = new URLSearchParams(window.location.search);
    const para = params.get('para');
    if (para) {
        const nameEl = document.getElementById('nombre-invitado-vip');
        if (nameEl) {
            nameEl.innerText = para.replace(/\+/g, ' ');
        }
    }
}

function activarInvitacion() {
    if (yaAbrio) return;
    yaAbrio = true;

    const imgSobre = document.getElementById('imgSobreEstetica');
    const videoSobre = document.getElementById('videoSobre');
    const intro = document.getElementById('contenedor-principal');
    const btnTexto = document.getElementById('btn-toca-abrir');
    const musica = document.getElementById('musicaInvitacion');
    const musicIcon = document.getElementById('music-toggle');

    if (btnTexto) { btnTexto.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Abriendo...'; btnTexto.style.opacity = "0.7"; }
    if (musica) { musica.currentTime = 0; musica.play().catch(e => console.log("Audio play err:", e)); }
    if (musicIcon) musicIcon.style.display = 'flex';
    if (imgSobre) imgSobre.style.opacity = '0';

    if (videoSobre) {
        videoSobre.style.display = 'block';
        videoSobre.currentTime = 0;
        let playPromise = videoSobre.play();
        const finish = () => transitionToMain(intro);
        if (playPromise !== undefined) {
            playPromise.then(() => { videoSobre.onended = finish; }).catch(finish);
        } else { videoSobre.onended = finish; }
        setTimeout(finish, 4000); // Respaldo
    } else { transitionToMain(intro); }
}

function transitionToMain(intro) {
    if (intro) { intro.style.opacity = '0'; }
    setTimeout(() => {
        if (intro) intro.style.display = 'none';
        const finalSec = document.getElementById('seccion-final');
        if (finalSec) finalSec.classList.remove('oculto');
        window.scrollTo(0, 0);
        cargarVIP();
        iniciarScrollAnimations();
        setInterval(actualizarContador, 1000);
        actualizarContador();
    }, 600);
}

function toggleMusic() {
    const m = document.getElementById('musicaInvitacion');
    const ic = document.getElementById('music-toggle');
    if (!m || !ic) return;
    if (m.paused) { m.play(); ic.innerHTML = '<i class="fa-solid fa-music"></i>'; }
    else { m.pause(); ic.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>'; }
}

function revealDate(btn, texto) {
    btn.innerText = texto;
    btn.classList.add('revealed');
    btn.onclick = null;

    const circles = document.querySelectorAll('.circle-btn');
    let todosRevelados = true;
    circles.forEach(c => {
        if (!c.classList.contains('revealed')) todosRevelados = false;
    });

    if (todosRevelados) {
        const contenedor = document.getElementById('revealed-date-msg');
        if (contenedor) contenedor.classList.add('show-revealed');
    }
}

function toggleBancos() {
    const contenedor = document.getElementById('contenedor-bancos');
    const btn = document.getElementById('btn-ver-bancos');
    if (contenedor.classList.contains('oculto')) {
        contenedor.classList.remove('oculto');
        btn.innerHTML = '<i class="fa-solid fa-vault" style="color:var(--gold-sutil);"></i> Ocultar Datos Bancarios';
    } else {
        contenedor.classList.add('oculto');
        btn.innerHTML = '<i class="fa-solid fa-vault" style="color:var(--gold-sutil);"></i> Ver Datos Bancarios';
    }
}

/* CONTROL DEL CARRUSEL DESLIZABLE MANUALMENTE */
function actualizarIndicadorScroll() {
    const track = document.getElementById('carouselTrack');
    const dots = document.querySelectorAll('.dot');
    if (!track || dots.length === 0) return;
    
    const slideWidth = track.clientWidth;
    const scrollLeft = track.scrollLeft;
    const index = Math.round(scrollLeft / slideWidth);

    dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === index);
    });
}

function irASlide(index) {
    const track = document.getElementById('carouselTrack');
    if (!track) return;
    const slideWidth = track.clientWidth;
    track.scrollTo({
        left: slideWidth * index,
        behavior: 'smooth'
    });
}

function enviarCancion() {
    const val = document.getElementById('input-cancion').value.trim();
    if (!val) { alert("Por favor ingresa el nombre de la canción."); return; }
    
    const btn = event.target;
    const textoOriginal = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';
    
    const urlFinal = `${SCRIPT_URL}?tipo=cancion&cancion=${encodeURIComponent(val)}`;
    
    fetch(urlFinal, { method: 'GET', mode: 'no-cors' })
    .then(() => {
        mostrarToast("¡Canción sugerida con éxito! 🎶");
        document.getElementById('input-cancion').value = '';
        btn.innerHTML = textoOriginal;
    }).catch(err => {
        alert("Hubo un error al enviar. Inténtalo de nuevo.");
        btn.innerHTML = textoOriginal;
    });
}

function enviarDeseo() {
    const nombre = document.getElementById('input-nombre-deseo').value.trim();
    const texto = document.getElementById('input-texto-deseo').value.trim();
    if (!nombre || !texto) { alert("Por favor completa tu nombre y mensaje."); return; }
    
    const btn = event.target;
    const textoOriginal = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';
    
    const urlFinal = `${SCRIPT_URL}?tipo=deseo&nombre=${encodeURIComponent(nombre)}&mensaje=${encodeURIComponent(texto)}`;
    
    fetch(urlFinal, { method: 'GET', mode: 'no-cors' })
    .then(() => {
        mostrarToast("¡Deseo guardado en el libro de los novios! 🤍");
        document.getElementById('input-nombre-deseo').value = '';
        document.getElementById('input-texto-deseo').value = '';
        btn.innerHTML = textoOriginal;
    }).catch(err => {
        alert("Hubo un error al enviar. Inténtalo de nuevo.");
        btn.innerHTML = textoOriginal;
    });
}

function mostrarToast(mensaje) {
    const t = document.getElementById('toast');
    t.innerHTML = `<i class="fa-solid fa-check-circle" style="color:var(--gold-sutil);"></i> ${mensaje}`;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3500);
}

function iniciarScrollAnimations() {
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('active'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

function actualizarContador() {
    const meta = new Date("2026-11-28T18:30:00").getTime();
    const dif = meta - new Date().getTime();
    if (dif > 0) {
        document.getElementById('days').innerText = Math.floor(dif / 86400000).toString().padStart(2, '0');
        document.getElementById('hours').innerText = Math.floor((dif % 86400000) / 3600000).toString().padStart(2, '0');
        document.getElementById('minutes').innerText = Math.floor((dif % 3600000) / 60000).toString().padStart(2, '0');
        document.getElementById('seconds').innerText = Math.floor((dif % 60000) / 1000).toString().padStart(2, '0');
    }
}

function copiarTexto(texto) {
    navigator.clipboard.writeText(texto).then(() => {
        const t = document.getElementById('toast');
        t.classList.add('show');
        setTimeout(() => t.classList.remove('show'), 2800);
    });
}
