import { Head } from '@inertiajs/react';
import { FormEvent, useEffect, useRef, useState } from 'react';

const styles = String.raw`

    :root {
    --purple:       #40c2a0;
    --purple-dark:  #2a8f76;
    --purple-light: #6ed8bf;
    --purple-pale:  #ede9fb;
    --orange:       #f5a623;
    --orange-bg:    #fef3dc;

    /* Light */
    --bg:           #f8f7fc;
    --bg2:          #ffffff;
    --surface:      #ffffff;
    --surface2:     #f3f1f9;
    --border:       #e8e4f3;
    --text:         #14112a;
    --text2:        #6b6585;
    --text3:        #9b96b0;
    --nav-bg:       rgba(248,247,252,0.92);
    --nav-border:   rgba(64,194,160,0.10);
    --shadow-sm:    0 1px 3px rgba(64,194,160,.07);
    --shadow-md:    0 4px 20px rgba(64,194,160,.10);
    --shadow-lg:    0 12px 48px rgba(64,194,160,.14);

    --font: 'Plus Jakarta Sans', sans-serif;
    --radius: 16px;
    --radius-sm: 10px;
    --page-x: clamp(24px, 3vw, 56px);
}

    [data-theme="dark"] {
    --bg:           #0e0c18;
    --bg2:          #13101f;
    --surface:      #1a1630;
    --surface2:     #231e38;
    --border:       rgba(255,255,255,.08);
    --text:         #f0eeff;
    --text2:        #a09bbf;
    --text3:        #6b6585;
    --nav-bg:       rgba(14,12,24,0.95);
    --nav-border:   rgba(255,255,255,.07);
    --shadow-sm:    0 1px 3px rgba(0,0,0,.3);
    --shadow-md:    0 4px 20px rgba(0,0,0,.4);
    --shadow-lg:    0 12px 48px rgba(0,0,0,.5);
}


    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    html{scroll-behavior:smooth;scroll-padding-top:80px}
    body{font-family:var(--font);background:var(--bg);color:var(--text);line-height:1.6;overflow-x:hidden;transition:background .3s,color .3s}
    .welcome-page{font-family:var(--font)!important}


    @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
    @keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(245,166,35,.5)}50%{box-shadow:0 0 0 8px rgba(245,166,35,0)}}
    .reveal{
    opacity:0;
    transform:translateY(40px);
    transition:opacity .65s cubic-bezier(.22,.68,0,1.2), transform .65s cubic-bezier(.22,.68,0,1.2);
}
    .reveal.in{opacity:1;transform:translateY(0)}
    .reveal-delay-1{transition-delay:.1s}
    .reveal-delay-2{transition-delay:.2s}
    .reveal-delay-3{transition-delay:.3s}
    .reveal-delay-4{transition-delay:.4s}


    nav{
    position:fixed;top:0;left:0;right:0;z-index:100;
    display:flex;align-items:center;justify-content:space-between;
    padding:0 var(--page-x);height:78px;
    background:var(--nav-bg);
    border-bottom:1px solid var(--nav-border);
    backdrop-filter:blur(16px);
    transition:box-shadow .3s,background .3s;
}
    nav.scrolled{box-shadow:var(--shadow-md)}

    .nav-logo{display:inline-flex;align-items:center;text-decoration:none}
    .logo-svg{display:inline-flex;align-items:center}
    .logo-svg .welcome-logo{display:block;height:auto;width:210px;max-width:100%}
    .logo-svg .welcome-logo-dark{display:none}
    .logo-svg-nav .welcome-logo{height:auto;width:210px;max-width:100%}
    .logo-svg-footer .welcome-logo{height:auto;width:210px;max-width:100%}
    [data-theme="dark"] .logo-svg .welcome-logo-light{display:none}
    [data-theme="dark"] .logo-svg .welcome-logo-dark{display:block}

    .nav-links{display:flex;gap:2rem;list-style:none}
    .nav-links a{font-size:.9rem;font-weight:500;color:var(--text2);text-decoration:none;transition:color .2s}
    .nav-links a:hover,.nav-links a.active{color:var(--text);font-weight:600}

    .nav-right{display:flex;align-items:center;gap:.75rem}

    .theme-btn{
    width:38px;height:38px;border-radius:50%;
    background:transparent;border:1.5px solid var(--border);cursor:pointer;
    display:flex;align-items:center;justify-content:center;
    transition:background .2s,border-color .2s,transform .2s;
    color:var(--text2);
}
    .theme-btn:hover{background:var(--orange);border-color:var(--orange);color:#fff;transform:scale(1.08)}
    [data-theme="dark"] .theme-btn{border-color:var(--border);color:var(--text2)}
    [data-theme="dark"] .theme-btn:hover{background:var(--orange);border-color:var(--orange);color:#fff}
    .icon-sun{display:none}
    .icon-moon{display:block}
    [data-theme="dark"] .icon-sun{display:block}
    [data-theme="dark"] .icon-moon{display:none}

    .btn-login{
    font-family:var(--font);font-size:.88rem;font-weight:600;
    color:var(--text2);background:transparent;
    border:1.5px solid var(--border);cursor:pointer;
    padding:.5rem 1.2rem;border-radius:50px;
    transition:color .2s,border-color .2s,background .2s;
}
    .btn-login:hover{color:var(--purple);border-color:var(--purple);background:var(--purple-pale)}
    .btn-login,.btn-cta-nav,.btn-primary{display:inline-flex;align-items:center;justify-content:center;text-decoration:none}
    [data-theme="dark"] .btn-login:hover{background:rgba(64,194,160,.15)}
    .btn-cta-nav{
    font-family:var(--font);font-size:.88rem;font-weight:700;
    color:#fff;background:var(--purple);
    border:none;cursor:pointer;padding:.55rem 1.4rem;border-radius:50px;
    box-shadow:0 4px 14px rgba(64,194,160,.35);
    transition:background .2s,transform .15s;
}
    .btn-cta-nav:hover{background:var(--purple-dark);transform:translateY(-1px)}


    .hero{
    padding:100px 5% 80px;
    display:flex;flex-direction:column;align-items:center;justify-content:center;
    text-align:center;position:relative;overflow:hidden;
}
    .hero-top{
    position:relative;z-index:1;
    width:100%;max-width:1200px;
    display:grid;grid-template-columns:1.05fr .95fr;gap:2rem;align-items:center;
}
    .hero-copy{
    text-align:left;display:flex;flex-direction:column;align-items:flex-start;
}
    .hero-visual{
    position:relative;width:100%;min-height:500px;
    display:flex;align-items:center;justify-content:center;
}
    .hero-system-anim{
    position:relative;inset:auto;pointer-events:none;z-index:0;overflow:hidden;
    width:100%;height:500px;min-height:575px;
}
    .hero-starfield{
    position:absolute;inset:0;z-index:0;pointer-events:none;
}
    .hero-star{
    position:absolute;border-radius:50%;
    width:var(--s,2px);height:var(--s,2px);
    background:rgba(255,255,255,.95);
    opacity:.08;
    transform:translateZ(0);
    box-shadow:0 0 9px rgba(255,255,255,.62),0 0 16px rgba(255,255,255,.28);
    animation:hero-star-twinkle var(--d,4.8s) ease-in-out infinite;
    animation-delay:var(--dl,0s);
}
    .hero-star.warm{
    background:rgba(255,255,255,.95);
    box-shadow:0 0 9px rgba(255,255,255,.62),0 0 16px rgba(255,255,255,.28);
}
    .hero-star.bright{
    box-shadow:0 0 13px rgba(255,255,255,.95),0 0 24px rgba(255,255,255,.5);
}
    .hero-flow-hub{
    position:absolute;left:50%;top:53%;transform:translate(-50%,-50%);
    width:118px;height:118px;border-radius:50%;
    background:radial-gradient(circle at 35% 30%, rgba(255,255,255,.35), rgba(64,194,160,.95) 62%);
    box-shadow:0 0 0 1px rgba(255,255,255,.06),0 16px 42px rgba(64,194,160,.35);
    display:flex;align-items:center;justify-content:center;
}
    .hero-flow-hub svg{width:58px;height:58px;overflow:visible}
    .hero-flow-hub .a{fill:#f1ebff}
    .hero-flow-hub .b{fill:#ffc64d}
    .hero-flow-orbit{
    position:absolute;left:50%;top:53%;transform:translate(-50%,-50%);
    border:1px dashed rgba(64,194,160,.33);border-radius:999px;
}
    .hero-flow-orbit.o1{width:260px;height:260px;animation:hero-orbit-cw 24s linear infinite}
    .hero-flow-orbit.o2{width:360px;height:360px;animation:hero-orbit-ccw 33s linear infinite}
    .hero-flow-orbit.o3{width:500px;height:300px;animation:hero-orbit-cw 39s linear infinite}
    .hero-flow-node{
    position:absolute;top:50%;left:100%;transform:translate(-50%,-50%);
    width:38px;height:38px;min-width:38px;border-radius:50%;
    display:inline-flex;align-items:center;justify-content:center;
    border:1px solid rgba(74,222,190,.38);
    background:rgba(255,255,255,.82);
    color:#40c2a0;
    box-shadow:0 6px 20px rgba(64,194,160,.18);
}
    .hero-flow-node svg{width:17px;height:17px;stroke:currentColor;fill:none;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}
    .hero-flow-node .fill{fill:currentColor;stroke:none}
    .hero-flow-node.n2{left:0}
    .hero-flow-node.n3{left:50%;top:0}
    .hero-flow-node.n4{left:50%;top:100%}
    .hero-flow-lane{
    position:absolute;left:50%;width:min(100%,460px);height:1px;
    transform:translateX(-50%);background:linear-gradient(90deg,transparent,rgba(74,222,190,.42),transparent);
}
    .hero-flow-lane.l1{top:35%}
    .hero-flow-lane.l2{top:67%}
    .hero-flow-packet{
    position:absolute;top:50%;left:0;transform:translate(-50%,-50%);
    width:9px;height:9px;border-radius:50%;
    background:var(--orange);box-shadow:0 0 0 6px rgba(245,166,35,.15),0 0 16px rgba(245,166,35,.6);
    animation:hero-packet 7.5s linear infinite;
}
    .hero-flow-lane.l2 .hero-flow-packet{animation-duration:9.5s;animation-direction:reverse}
    .hero-flow-core-dot{
    position:absolute;left:50%;top:53%;transform:translate(-50%,-50%);
    width:10px;height:10px;border-radius:50%;
    background:var(--orange);z-index:2;
    box-shadow:0 0 0 6px rgba(245,166,35,.14),0 0 16px rgba(245,166,35,.45);
}
    .hero-connector{
    position:absolute;left:50%;top:53%;
    width:0;height:0;transform:translate(-50%,-50%) rotate(var(--a));
    animation:hero-conn-spin 18s linear infinite;
    z-index:1;
}
    .hero-connector.ccw{animation-direction:reverse}
    .hero-connector::before{
    content:"";position:absolute;left:0;top:-1px;height:2px;width:var(--r);
    background:linear-gradient(90deg, rgba(245,166,35,.85), rgba(245,166,35,.08) 70%, transparent);
    opacity:.45;transform-origin:left center;
    animation:hero-link-pulse 2.9s ease-in-out infinite;
    animation-delay:var(--d);
}
    .hero-connector .dot-end{
    position:absolute;left:var(--r);top:0;transform:translate(-50%,-50%);
    width:10px;height:10px;border-radius:50%;background:var(--orange);
    box-shadow:0 0 0 6px rgba(245,166,35,.12),0 0 14px rgba(245,166,35,.42);
    animation:hero-dot-pulse 2.9s ease-in-out infinite;
    animation-delay:var(--d);
}
    .hero-connector .dot-start{
    position:absolute;left:0;top:0;transform:translate(-50%,-50%);
    width:6px;height:6px;border-radius:50%;background:#ffd57b;opacity:.9;
    animation:hero-dot-pulse 2.9s ease-in-out infinite;
    animation-delay:var(--d);
}

    /* Light hero background */
    .hero-bg{
    position:absolute;inset:0;pointer-events:none;z-index:0;
    background:
    radial-gradient(ellipse 80% 60% at 20% 50%, rgba(220,210,255,.5) 0%, transparent 60%),
    radial-gradient(ellipse 60% 60% at 80% 70%, rgba(255,230,180,.3) 0%, transparent 60%),
    var(--bg);
}
    [data-theme="dark"] .hero-bg{
    background:
    radial-gradient(ellipse 70% 60% at 20% 50%, rgba(64,194,160,.2) 0%, transparent 60%),
    radial-gradient(ellipse 50% 50% at 80% 70%, rgba(245,166,35,.08) 0%, transparent 60%),
    var(--bg);
}
    [data-theme="dark"] .hero-flow-orbit{border-color:rgba(165,145,236,.5)}
    [data-theme="dark"] .hero-flow-node{
    background:rgba(35,30,56,.92);border-color:rgba(165,145,236,.45);color:#d9ccff;
}
    [data-theme="dark"] .hero-flow-lane{
    background:linear-gradient(90deg,transparent,rgba(165,145,236,.52),transparent);
}
    [data-theme="dark"] .hero-flow-hub{
    background:radial-gradient(circle at 35% 30%, rgba(196,245,233,.42), rgba(64,194,160,.96) 62%);
}
    [data-theme="dark"] .hero-star{
    background:rgba(255,255,255,.98);
    box-shadow:0 0 10px rgba(255,255,255,.82),0 0 20px rgba(255,255,255,.4);
}
    [data-theme="dark"] .hero-star.warm{
    background:rgba(255,255,255,.98);
    box-shadow:0 0 10px rgba(255,255,255,.82),0 0 20px rgba(255,255,255,.4);
}
    [data-theme="dark"] .hero-star.bright{
    box-shadow:0 0 16px rgba(255,255,255,1),0 0 28px rgba(255,255,255,.56);
}
    [data-theme="dark"] .hero-connector::before{
    opacity:.65;
    background:linear-gradient(90deg, rgba(255,190,76,.95), rgba(255,190,76,.15) 70%, transparent);
}
    [data-theme="dark"] .hero-connector .dot-end{
    box-shadow:0 0 0 7px rgba(255,190,76,.15),0 0 18px rgba(255,190,76,.58);
}
    @keyframes hero-orbit-cw{to{transform:translate(-50%,-50%) rotate(360deg)}}
    @keyframes hero-orbit-ccw{to{transform:translate(-50%,-50%) rotate(-360deg)}}
    @keyframes hero-packet{to{left:100%}}
    @keyframes hero-conn-spin{to{transform:translate(-50%,-50%) rotate(calc(var(--a) + 360deg))}}
    @keyframes hero-link-pulse{
    0%,100%{opacity:.2}
    50%{opacity:.72}
}
    @keyframes hero-dot-pulse{
    0%,100%{transform:translate(-50%,-50%) scale(.88)}
    50%{transform:translate(-50%,-50%) scale(1.15)}
}
    @keyframes hero-star-twinkle{
    0%,100%{opacity:.08;transform:scale(.7)}
    30%{opacity:.65;transform:scale(1)}
    52%{opacity:.22;transform:scale(.82)}
    72%{opacity:.82;transform:scale(1.08)}
}

    .hero-badge{
    position:relative;z-index:1;
    display:inline-flex;align-items:center;gap:.5rem;
    background:var(--surface);color:var(--text2);
    border:1px solid var(--border);
    font-size:.82rem;font-weight:500;
    padding:.4rem 1rem;border-radius:50px;margin-bottom:1.35rem;
    animation:fadeUp .5s ease both;
    box-shadow:var(--shadow-sm);
}
    .badge-pulse{
    width:8px;height:8px;border-radius:50%;
    background:var(--orange);flex-shrink:0;
    animation:pulse 2s infinite;
}

    .hero h1{
    position:relative;z-index:1;
    font-size:clamp(2.2rem,4vw,3.6rem);font-weight:900;
    line-height:1.1;letter-spacing:-.03em;
    color:var(--text);max-width:620px;
    animation:fadeUp .5s .1s ease both;
}
    .hero h1 .purple{color:var(--purple)}
    .hero h1 .one-hub-pill{
    display:inline-block;margin-top:.58rem;margin-bottom:1rem;padding:.04em .36em .1em;
    font-size:.82em;line-height:1;white-space:nowrap;
    border-radius:999px;background:#ffae43;color:#fff;
    transform:rotate(-2deg);
    transform-origin:left center;
    box-shadow:0 7px 18px rgba(255,174,67,.35);
    text-shadow:0 1px 1px rgba(0,0,0,.16);
}

    .hero-sub{
    position:relative;z-index:1;
    font-size:1.05rem;font-weight:400;color:var(--text2);
    max-width:560px;margin:1.35rem 0 0;line-height:1.75;
    animation:fadeUp .5s .2s ease both;
}

    .hero-ctas{
    position:relative;z-index:1;
    display:flex;gap:.9rem;margin-top:3rem;justify-content:flex-start;flex-wrap:wrap;
    animation:fadeUp .5s .3s ease both;
}
    .btn-primary{
    font-family:var(--font);font-size:.95rem;font-weight:700;
    color:#fff;background:var(--purple);
    padding:.8rem 1.8rem;border-radius:50px;border:none;cursor:pointer;
    display:flex;align-items:center;gap:.4rem;
    box-shadow:0 6px 22px rgba(64,194,160,.38);
    transition:background .2s,transform .15s,box-shadow .2s;
}
    .btn-primary:hover{background:var(--orange);transform:translateY(-2px);box-shadow:0 10px 28px rgba(245,166,35,.4)}
    .btn-outline{
    font-family:var(--font);font-size:.95rem;font-weight:600;
    color:var(--text);background:var(--surface);
    padding:.8rem 1.8rem;border-radius:50px;
    border:1.5px solid var(--border);cursor:pointer;
    display:flex;align-items:center;gap:.5rem;
    transition:border-color .2s,background .2s,color .2s;
}
    .btn-outline:hover{border-color:var(--orange);background:var(--orange);color:#fff}
    [data-theme="dark"] .btn-outline:hover{border-color:var(--orange);background:var(--orange);color:#fff}

    .hero-note{
    position:relative;z-index:1;
    font-size:.8rem;color:var(--text3);margin-top:.9rem;text-align:left;
    animation:fadeUp .5s .35s ease both;
}
    .hero-mockup{
    position:relative;z-index:1;
    width:100%;max-width:1200px;margin-top:3.2rem;
    animation:fadeUp .6s .45s ease both;
}
    .mockup-frame{
    background:var(--surface);
    border-radius:18px;
    border:1px solid var(--border);
    box-shadow:var(--shadow-lg),0 0 0 1px var(--border);
    overflow:hidden;
}
    .mockup-bar{
    background:var(--surface2);
    padding:11px 16px;
    display:flex;align-items:center;gap:12px;
    border-bottom:1px solid var(--border);
}
    .mockup-dots{display:flex;gap:5px}
    .mockup-dots span{width:10px;height:10px;border-radius:50%}
    .mockup-dots span:nth-child(1){background:#ff5f57}
    .mockup-dots span:nth-child(2){background:#ffbd2e}
    .mockup-dots span:nth-child(3){background:#27c93f}
    .mockup-url{
    flex:1;background:var(--bg);border-radius:6px;
    padding:4px 12px;font-size:.73rem;color:var(--text3);text-align:center;
}

    /* Inner dashboard */
    .dash-inner{padding:20px}
    .dash-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:14px}
    .dash-stat-card{
    background:var(--surface);border:1px solid var(--border);
    border-radius:var(--radius-sm);padding:16px;text-align:center;
}
    .dash-stat-icon{font-size:1.3rem;margin-bottom:6px}
    .dash-stat-val{font-size:1.6rem;font-weight:700;color:var(--text);letter-spacing:-.02em}
    .dash-stat-label{font-size:.72rem;color:var(--text2);margin-top:2px}

    .dash-bottom{display:grid;grid-template-columns:1fr .52fr;gap:12px}
    .dash-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-sm);padding:16px}
    .dash-card h4{font-size:.8rem;font-weight:700;color:var(--text);margin-bottom:10px}

    .ticket-row{display:flex;align-items:center;gap:8px;padding:7px 0;border-bottom:1px solid var(--border)}
    .ticket-row:last-child{border-bottom:none}
    .tk-id{font-size:.68rem;color:var(--text3);font-weight:600;min-width:46px}
    .tk-title{font-size:.78rem;color:var(--text);flex:1}
    .tk-time{font-size:.72rem;color:var(--text2);margin-left:auto}
    .tk-icon{width:18px;height:18px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.6rem;flex-shrink:0}
    .tk-purple{background:rgba(64,194,160,.15);color:var(--purple)}
    .tk-orange{background:rgba(245,166,35,.15);color:var(--orange)}
    .tk-green{background:rgba(34,197,94,.15);color:#22c55e}

    .timer-display{
    font-size:1.8rem;font-weight:700;color:var(--purple);
    letter-spacing:.04em;text-align:center;padding:10px 0 4px;
}
    .timer-label{font-size:.72rem;color:var(--text2);text-align:center;margin-bottom:12px}
    .timer-bar{background:var(--border);border-radius:100px;height:6px;margin-bottom:6px}
    .timer-fill{background:var(--purple);border-radius:100px;height:6px;width:75%}
    .timer-goal{font-size:.7rem;color:var(--text3)}


    .trust-bar{
    padding:3rem 0;
    background:var(--bg2);
    border-top:1px solid var(--border);border-bottom:1px solid var(--border);
    text-align:center;
    overflow:hidden;
}
    .trust-label{font-size:.72rem;color:var(--text3);font-weight:600;letter-spacing:.08em;text-transform:uppercase;margin-bottom:1.75rem}
    .trust-track-wrapper{
    overflow:hidden;
    position:relative;
    /* fade edges */
    mask-image:linear-gradient(to right,transparent 0%,black 10%,black 90%,transparent 100%);
    -webkit-mask-image:linear-gradient(to right,transparent 0%,black 10%,black 90%,transparent 100%);
}
    .trust-track{
    display:flex;align-items:center;gap:4rem;
    width:max-content;
    animation:marquee 22s linear infinite;
}
    .trust-track:hover{animation-play-state:paused}
    @keyframes marquee{
    from{transform:translateX(0)}
    to{transform:translateX(-50%)}
}
    .trust-logo{
    font-family:var(--font);font-weight:700;font-size:1.15rem;
    color:var(--text3);letter-spacing:-.01em;
    white-space:nowrap;cursor:default;
    opacity:.45;
    transition:opacity .2s,color .2s;
}
    .trust-logo:hover{opacity:1;color:var(--purple)}


    .section{padding:100px 5%}
    .section-center{text-align:center}

    .eyebrow{
    display:inline-block;
    font-size:.72rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;
    color:var(--purple);margin-bottom:1rem;
}
    .section-title{
    font-size:clamp(1.9rem,3.2vw,2.8rem);font-weight:700;
    line-height:1.15;letter-spacing:-.025em;color:var(--text);margin-bottom:.9rem;
}
    .section-sub{font-size:1rem;font-weight:400;color:var(--text2);line-height:1.7;max-width:520px}
    .section-center .section-sub{margin:0 auto}

    .features-section{background:var(--bg)}
    .features-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:1rem;margin-top:3.5rem;max-width:1100px;margin-left:auto;margin-right:auto}
    .feat-card{
    background:var(--surface);padding:2.5rem;
    border:1px solid var(--border);border-radius:var(--radius);
    transition:transform .22s ease,box-shadow .22s ease,border-color .22s ease;
}
    .feat-card:hover{
    transform:translateY(-5px);
    box-shadow:0 12px 40px rgba(64,194,160,.12);
    border-color:rgba(64,194,160,.18);
}
    .feat-icon{
    width:46px;height:46px;border-radius:var(--radius-sm);
    background:var(--purple-pale);display:flex;align-items:center;justify-content:center;
    margin-bottom:1.2rem;
    transition:background .22s ease;
}
    [data-theme="dark"] .feat-icon{background:rgba(64,194,160,.2)}
    .feat-card:hover .feat-icon{background:rgba(64,194,160,.22)}
    [data-theme="dark"] .feat-card:hover .feat-icon{background:rgba(64,194,160,.4)}
    .feat-icon svg{width:22px;height:22px;color:var(--purple);transition:color .22s ease}
    .feat-card:hover .feat-icon svg{color:var(--purple-dark)}
    .feat-card h3{font-size:1.05rem;font-weight:700;color:var(--text);margin-bottom:.5rem}
    .feat-card p{font-size:.875rem;color:var(--text2);line-height:1.7}


    .integrations-section{background:var(--bg)}
    .int-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-top:3rem;max-width:600px;margin-left:auto;margin-right:auto}
    .int-card{
    background:var(--surface);border:1px solid var(--border);
    border-radius:var(--radius);padding:2rem 1.5rem;text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;
    transition:border-color .2s,transform .2s,box-shadow .2s;
}
    .int-card:hover{border-color:var(--purple);transform:translateY(-3px);box-shadow:var(--shadow-md)}
    .int-card svg{display:block;color:var(--purple);margin:0 auto .75rem;flex-shrink:0}
    .int-card h4{font-size:.9rem;font-weight:700;color:var(--text);margin-bottom:.25rem}
    .int-card p{font-size:.78rem;color:var(--text2)}

    .spotlight-section{background:var(--bg);padding-top:40px}
    .spotlight-grid{display:grid;grid-template-columns:1fr 1fr;gap:1.25rem;max-width:1100px;margin:3rem auto 0}
    .spotlight-card{
    background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);
    padding:2rem;position:relative;overflow:hidden;
}
    .spotlight-card::before{
    content:"";position:absolute;inset:-1px;border-radius:var(--radius);
    background:linear-gradient(115deg,rgba(64,194,160,.24),rgba(74,222,190,.16),rgba(64,194,160,.08));
    z-index:0;opacity:.35;pointer-events:none;
}
    .spotlight-card > *{position:relative;z-index:1}
    .spotlight-icon{
    width:54px;height:54px;border-radius:12px;border:1px solid rgba(74,222,190,.38);
    background:rgba(74,222,190,.11);display:flex;align-items:center;justify-content:center;
    color:var(--purple-light);margin-bottom:1rem;
}
    .spotlight-card h3{font-size:1.4rem;font-weight:700;line-height:1.2;letter-spacing:-.02em;margin-bottom:.7rem;color:var(--text)}
    .spotlight-card p{font-size:.92rem;line-height:1.7;color:var(--text2);max-width:96%}
    .spotlist{margin-top:1.25rem;display:grid;gap:.7rem}
    .spotrow{
    display:flex;align-items:center;justify-content:space-between;
    border:1px solid var(--border);background:var(--bg2);border-radius:12px;padding:.75rem .85rem;
}
    .spotrow strong{font-size:.86rem;color:var(--text)}
    .spotrow span{font-size:.76rem;color:var(--text2)}
    .ai-chat-demo{
    margin-top:1.25rem;border:1px solid var(--border);background:var(--bg2);
    border-radius:14px;padding:.95rem;display:grid;gap:.55rem;
}
    .chat-row{display:flex;align-items:center;gap:.5rem}
    .chat-row.user{justify-content:flex-end}
    .chat-badge{
    width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;
    background:rgba(74,222,190,.2);color:var(--purple);font-size:.72rem;font-weight:700;flex-shrink:0;
}
    .chat-msg{
    max-width:78%;padding:.5rem .7rem;border-radius:10px;font-size:.75rem;line-height:1.45;
    border:1px solid var(--border);background:var(--surface);color:var(--text2);
}
    .chat-row.user .chat-msg{background:rgba(74,222,190,.12);color:var(--text)}
    .analytics-mini{
    margin-top:1.25rem;border:1px solid var(--border);background:var(--bg2);
    border-radius:14px;padding:.8rem .8rem .65rem;
}
    .analytics-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:.45rem}
    .analytics-head strong{font-size:.85rem;color:var(--text)}
    .analytics-chip{
    font-size:.66rem;font-weight:700;color:var(--purple);
    border:1px solid rgba(74,222,190,.4);border-radius:999px;padding:.18rem .45rem;background:rgba(74,222,190,.1);
}
    .analytics-svg{width:100%;height:130px;display:block}
    .analytics-axis{stroke:rgba(120,110,160,.22);stroke-width:1}
    .analytics-line{stroke:var(--purple-light);stroke-width:3;fill:none;stroke-linecap:round}
    .analytics-fill{fill:url(#anaFill)}
    .analytics-dot{fill:#fff;stroke:var(--purple);stroke-width:3}
    .mini-orbit-wrap{
    margin-top:1.25rem;height:220px;position:relative;
    display:flex;align-items:center;justify-content:center;
}
    .mini-orbit-center{
    width:74px;height:74px;border-radius:50%;
    background:linear-gradient(135deg,var(--purple),var(--purple-light));
    display:flex;align-items:center;justify-content:center;
    box-shadow:0 10px 28px rgba(64,194,160,.32);
}
    .mini-orbit-center svg{width:34px;height:34px}
    .mini-orbit-center .a{fill:#f1ebff}
    .mini-orbit-center .b{fill:#ffc64d}
    .mini-orbit-ring{
    position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);
    border:1px dashed rgba(74,222,190,.45);border-radius:50%;
}
    .mini-orbit-ring.outer{width:198px;height:198px;animation:mini-orbit-cw 18s linear infinite}
    .mini-orbit-ring.inner{width:124px;height:124px;animation:mini-orbit-ccw 11s linear infinite}
    .mini-orbit-node{
    position:absolute;left:50%;top:50%;
    width:34px;height:34px;border-radius:50%;
    border:1px solid var(--border);background:var(--surface2);
    display:flex;align-items:center;justify-content:center;
    color:var(--purple-light);font-size:.92rem;font-weight:700;
    transform:translate(-50%,-50%) rotate(var(--a)) translateX(var(--r)) rotate(calc(-1 * var(--a)));
}
    @keyframes mini-orbit-cw{to{transform:translate(-50%,-50%) rotate(360deg)}}
    @keyframes mini-orbit-ccw{to{transform:translate(-50%,-50%) rotate(-360deg)}}
    [data-theme="dark"] .chat-msg{background:rgba(35,30,56,.88)}
    [data-theme="dark"] .chat-row.user .chat-msg{background:rgba(74,222,190,.22)}
    [data-theme="dark"] .analytics-axis{stroke:rgba(180,170,220,.2)}
    [data-theme="dark"] .analytics-chip{
    color:#d8cbff;border-color:rgba(165,145,236,.45);background:rgba(165,145,236,.12);
}
    [data-theme="dark"] .mini-orbit-ring{border-color:rgba(165,145,236,.58)}
    .dash-plus-section{background:var(--bg);padding-top:20px}
    .dash-plus-wrap{
    max-width:1100px;margin:0 auto;border-radius:28px;padding:12px;
    background:linear-gradient(120deg,rgba(64,194,160,.28),rgba(74,222,190,.18));
}
    .dash-plus-inner{
    background:var(--surface);border:1px solid var(--border);border-radius:22px;padding:22px;
    box-shadow:var(--shadow-md);
}
    .dash-plus-top{
    display:flex;align-items:center;justify-content:space-between;gap:1rem;
    border-bottom:1px solid var(--border);padding-bottom:14px;margin-bottom:14px;
}
    .dash-plus-top h3{font-size:1.95rem;letter-spacing:-.02em;color:var(--text)}
    .dash-plus-chip{font-size:.8rem;border:1px solid var(--border);padding:.45rem .7rem;border-radius:999px;color:var(--text2)}
    .dash-plus-grid{display:grid;grid-template-columns:1.05fr .95fr;gap:14px}
    .dash-plus-card{background:var(--bg2);border:1px solid var(--border);border-radius:14px;padding:14px}
    .mini-metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:10px}
    .mini-metric{border:1px solid var(--border);border-radius:10px;padding:.65rem .7rem}
    .mini-metric strong{display:block;font-size:1.18rem;color:var(--text);line-height:1.1}
    .mini-metric span{font-size:.73rem;color:var(--text2)}
    .mini-chart{
    height:170px;border:1px solid var(--border);border-radius:12px;padding:10px;
    background:linear-gradient(180deg,rgba(64,194,160,.06),transparent 55%);
}
    .chart-line{width:100%;height:100%}
    .activity-list{display:grid;gap:.65rem}
    .activity-item{display:flex;align-items:center;justify-content:space-between;border:1px solid var(--border);border-radius:10px;padding:.6rem .7rem}
    .activity-item b{font-size:.85rem;color:var(--text)}
    .activity-item small{font-size:.72rem;color:var(--text2)}
    .activity-item em{font-size:.76rem;font-style:normal;font-weight:700;color:#22a65d}

    .faq-section{background:var(--bg);padding-top:30px}
    .faq-grid{max-width:1100px;margin:0 auto;display:grid;grid-template-columns:.9fr 1.1fr;gap:2rem;align-items:start}
    .faq-kicker{
    display:inline-flex;align-items:center;gap:.5rem;
    border:1px solid rgba(74,222,190,.32);color:var(--purple);
    background:rgba(74,222,190,.08);border-radius:999px;padding:.35rem .8rem;font-size:.82rem;font-weight:700;
}
    .faq-title{font-size:clamp(1.95rem,3.3vw,2.85rem);line-height:1.08;letter-spacing:-.03em;color:var(--text);margin-top:1rem;font-weight:700}
    .faq-title span{color:var(--purple)}
    .faq-desc{margin-top:1rem;color:var(--text2);font-size:1rem;line-height:1.7;max-width:500px}
    .faq-list{display:grid;gap:.9rem}
    .faq-item{border:1px solid var(--border);border-radius:14px;background:var(--surface);overflow:hidden}
    .faq-toggle{
    width:100%;display:flex;align-items:center;justify-content:space-between;gap:1rem;
    border:none;background:transparent;color:var(--text);font-family:var(--font);font-size:.98rem;
    font-weight:700;cursor:pointer;padding:1rem 1.05rem;text-align:left;
}
    .faq-ic{
    width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;
    border:1px solid var(--border);background:var(--surface2);color:var(--text2);transition:all .2s;
}
    .faq-item.open .faq-ic{background:var(--purple);border-color:var(--purple);color:#fff}
    .faq-answer{
    max-height:0;overflow:hidden;transition:max-height .3s ease,padding .3s ease;
    padding:0 1.05rem;color:var(--text2);line-height:1.7;
}
    .faq-item.open .faq-answer{max-height:220px;padding:0 1.05rem 1rem}

    .pricing-section{background:var(--bg)}
    .pricing-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.25rem;margin-top:3.5rem;max-width:1100px;margin-left:auto;margin-right:auto}
    .price-card{
    background:var(--surface);border:1px solid var(--border);
    border-radius:var(--radius);padding:2.25rem 2rem;
    transition:transform .2s,box-shadow .2s;
}
    .price-card:hover{transform:translateY(-4px);box-shadow:var(--shadow-lg)}
    .price-card.featured{
    background:var(--purple);border-color:var(--purple);
    transform:scale(1.03);
    box-shadow:0 20px 60px rgba(64,194,160,.4);
}
    .price-card.featured:hover{transform:scale(1.03) translateY(-4px)}
    .price-tier{font-size:.92rem;font-weight:600;color:var(--text);margin-bottom:.2rem}
    .price-card.featured .price-tier{color:rgba(255,255,255,.7);font-weight:600}
    .price-sub-desc{font-size:.86rem;font-weight:400;color:var(--text2);margin-bottom:1.2rem}
    .price-card.featured .price-sub-desc{color:rgba(255,255,255,.6)}
    .price-amount{font-size:2.6rem;font-weight:700;color:var(--text);letter-spacing:-.03em;line-height:1.08}
    .price-amount sup{font-size:1.1rem;font-weight:700;vertical-align:super}
    .price-amount .mo{font-size:.9rem;font-weight:500;opacity:.58}
    .price-card.featured .price-amount{color:#fff}
    .price-divider{height:1px;background:var(--border);margin:1.5rem 0}
    .price-card.featured .price-divider{background:rgba(255,255,255,.2)}
    .price-features{list-style:none;display:flex;flex-direction:column;gap:.65rem;margin-bottom:1.75rem}
    .price-features li{display:flex;align-items:center;gap:.6rem;font-size:.84rem;color:var(--text2)}
    .price-card.featured .price-features li{color:rgba(255,255,255,.8)}
    .check{color:var(--purple);flex-shrink:0}
    .price-card.featured .check{color:var(--orange)}
    .price-btn{
    width:100%;padding:.8rem;border-radius:50px;
    font-family:var(--font);font-size:.9rem;font-weight:700;cursor:pointer;
    border:1.5px solid var(--border);background:transparent;color:var(--text);
    transition:background .2s,border-color .2s,color .2s;
}
    .price-btn:hover{border-color:var(--purple);background:var(--purple-pale);color:var(--purple)}
    .price-card.featured .price-btn{background:#fff;color:var(--purple);border-color:#fff}
    .price-card.featured .price-btn:hover{background:rgba(255,255,255,.9)}


    footer{
    background:#07060d;
    padding:82px 5% 34px;
    border-top:1px solid rgba(165,145,236,.14);
    position:relative;overflow:hidden;
    --mx:50%;
    --my:30%;
    --footer-glow-opacity:0;
}
    .footer-cursor-glow{
    position:absolute;inset:0;pointer-events:none;z-index:0;opacity:var(--footer-glow-opacity);
    transition:opacity .28s ease;
    background:radial-gradient(950px circle at var(--mx) var(--my),
    rgba(64,194,160,.50) 0%,
    rgba(64,194,160,.25) 20%,
    rgba(64,194,160,.10) 45%,
    transparent 70%);
    mix-blend-mode:screen;
}
    .footer-shell{max-width:1220px;margin:0 auto;position:relative;z-index:1}
    .footer-cta{
    text-align:center;
    border-bottom:1px solid rgba(165,145,236,.2);
    padding-bottom:58px;
    margin-bottom:52px;
}
    .footer-kicker{
    font-size:.82rem;font-weight:700;letter-spacing:.28em;text-transform:uppercase;
    color:#6ed8bf;margin-bottom:1.2rem;
}
    .footer-title{
    font-family:var(--font);font-size:clamp(1.85rem,3.25vw,3rem);font-weight:700;
    color:#f2efff;line-height:1.04;letter-spacing:-.03em;
}
    .footer-title .journey-pill{
    display:inline-block;margin-top:.72rem;
    background:var(--purple);color:#fff;
    font-size:1em;
    font-weight:700;line-height:1.05;
    padding:.24em .66em .3em;border-radius:999px;
    box-shadow:0 8px 24px rgba(64,194,160,.34);
    transform:rotate(-1.7deg) translateY(.08em);
    transform-origin:left center;
    margin-bottom:40px;
}
    .footer-cta-copy{
    margin:1.6rem auto 0;max-width:760px;
    font-size:1.02rem;line-height:1.8;color:#b6aecf;
}
    .footer-cta-actions{
    margin-top:calc(2.15rem + 40px);display:flex;justify-content:center;gap:.95rem;flex-wrap:wrap;
}
    .footer-btn{
    font-family:var(--font);font-weight:700;font-size:1rem;
    border-radius:999px;padding:.86rem 1.5rem;text-decoration:none;
    display:inline-flex;align-items:center;gap:.5rem;transition:all .2s ease;
}
    .footer-btn-primary{
    background:#fff;color:#40c2a0;border:1px solid #fff;
}
    .footer-btn-primary:hover{background:#f2ecff}
    .footer-btn-secondary{
    background:transparent;color:#f2efff;border:1px solid rgba(165,145,236,.38);
}
    .footer-btn-secondary:hover{border-color:#a591ec;background:rgba(165,145,236,.12)}
    .footer-links{
    display:grid;grid-template-columns:repeat(5,minmax(0,1fr));
    gap:2.1rem;margin-bottom:3.2rem;
}
    .footer-col h5{
    font-size:1.02rem;font-weight:700;color:#fff;letter-spacing:.01em;margin-bottom:1.15rem;
}
    .footer-col ul{list-style:none;display:grid;gap:.78rem}
    .footer-col ul a{
    color:#aba2c8;font-size:1.02rem;line-height:1.35;text-decoration:none;transition:color .2s;
}
    .footer-col ul a:hover{color:#f2efff}
    .footer-bottom{
    border-top:1px solid rgba(165,145,236,.2);padding-top:1.4rem;text-align:center;
}
    .footer-bottom p{font-size:.86rem;color:#726b8e}
    .footer-legal{
    margin-top:.35rem;font-size:.78rem;color:#575072;line-height:1.6;
}
    .footer-legal a{color:#a8a1c7;text-decoration:none}
    .footer-legal a:hover{color:#f2efff;text-decoration:underline}

    @media(max-width:900px){
    .hero-top{grid-template-columns:1fr}
    .hero-copy{align-items:center;text-align:center}
    .hero-ctas{justify-content:center}
    .hero-note{text-align:center}
    .hero-visual{min-height:340px}
    .hero-system-anim{height:340px}
    .features-grid,.pricing-grid{grid-template-columns:1fr}
    .dash-bottom{grid-template-columns:1fr}
    .dash-stats{grid-template-columns:repeat(3,1fr)}
    .price-card.featured{transform:none}
    .hero{min-height:auto}
}
    @media(max-width:640px){
    :root{--page-x:16px}
    nav{padding:0 var(--page-x);height:78px}
    .logo-svg-nav .welcome-logo{height:auto;width:165px}
    .nav-links{display:none}
    .nav-right{gap:.45rem}
    .theme-btn{width:34px;height:34px}
    .btn-login,.btn-cta-nav{white-space:nowrap}
    .btn-login{font-size:.82rem;padding:.44rem .8rem}
    .btn-cta-nav{font-size:.82rem;padding:.5rem .95rem;border-radius:24px}
    .hero{padding:108px 5% 56px}
    .hero h1{font-size:clamp(2.1rem,11vw,2.8rem);max-width:340px}
    .hero-flow-orbit.o1{width:200px;height:200px}
    .hero-flow-orbit.o2{width:270px;height:270px}
    .hero-flow-orbit.o3,.hero-flow-lane{display:none}
    .hero-flow-node{width:34px;height:34px;min-width:34px}
    .hero-flow-hub{width:88px;height:88px}
    .hero-flow-hub svg{width:46px;height:46px}
    .hero-connector.c3{display:none}
    .hero-sub{font-size:1.02rem;max-width:340px;line-height:1.6}
    .hero-ctas{width:100%;gap:.7rem}
    .btn-primary,.btn-outline{width:100%;padding:.82rem 1.2rem;font-size:1.02rem;white-space:nowrap}
    .hero-note{font-size:.74rem}
    .hero-mockup{margin-top:2.2rem}
    .mockup-url{font-size:.66rem}
    .dash-stats{grid-template-columns:1fr 1fr}
    .dash-stat-card:last-child{grid-column:1 / -1}
    .int-grid{grid-template-columns:1fr}
    .spotlight-grid{grid-template-columns:1fr}
    .faq-grid{grid-template-columns:1fr}
    .dash-plus-grid{grid-template-columns:1fr}
    .section{padding:76px 5%}
    .trust-bar{padding:2.2rem 0}
    .footer-links{grid-template-columns:repeat(2,minmax(0,1fr));gap:1.8rem}
}
    @media (prefers-reduced-motion: reduce){
    .hero-flow-orbit,.hero-flow-packet,.hero-connector,.hero-connector::before,.hero-connector .dot-end,.hero-connector .dot-start,.hero-star{animation:none!important}
}
    @media(max-width:420px){
    .btn-login{display:none}
    .btn-cta-nav{padding:.5rem .85rem}
    .hero h1{font-size:clamp(1.95rem,10.6vw,2.5rem)}
    .footer-title{font-size:clamp(1.45rem,8.8vw,2.05rem)}
    .footer-title .journey-pill{
    margin-top:.38rem;
    font-size:1em;
}
    .footer-links{grid-template-columns:1fr}
    .footer-cta{padding-bottom:40px;margin-bottom:38px}
}
;

`;

const loginLogoSvg = String.raw`<span class="welcome-logo-wrap">
  <img src="/images/plunr-logo-light.svg" alt="Plunr" class="welcome-logo welcome-logo-light" />
  <img src="/images/plunr-logo2.svg" alt="Plunr" class="welcome-logo welcome-logo-dark" />
</span>`;

const markup = String.raw`
<!-- â”€â”€â”€ NAV â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ -->
<nav id="navbar">
    <a class="nav-logo" href="/"><span class="logo-svg logo-svg-nav"></span></a>

    <ul class="nav-links">
        <li><a href="#features">Features</a></li>
        <li><a href="#pricing">Pricing</a></li>
        <li><a href="#integrations">Integrations</a></li>
    </ul>

    <div class="nav-right">
        <button class="theme-btn" id="themeToggle" title="Toggle dark mode">
      <span class="icon-moon">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
      </span>
            <span class="icon-sun">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
      </span>
        </button>
        <a class="btn-login" href="/login">Log in</a>
        <a class="btn-cta-nav" href="/register">Start Free Trial</a>
    </div>
</nav>

<section class="hero">
    <div class="hero-bg"></div>
    <div class="hero-top">
        <div class="hero-copy">
            <span class="hero-badge">
            <span class="badge-pulse"></span>
            New: Smart Time Tracking is now live
          </span>

            <h1>Manage Your Entire <span class="purple">Workflow</span> From<br /><span class="one-hub-pill">One Hub</span></h1>

            <p class="hero-sub">Unify ticketing, time tracking, and reporting in a single platform. Boost your team's productivity and elevate customer satisfaction.</p>

            <div class="hero-ctas">
                <a class="btn-primary" href="/register">
                    Start Free Trial
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/></svg>
                </a>
                <button class="btn-outline">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
                    Watch Demo
                </button>
            </div>

            <p class="hero-note">No credit card required &bull; 14-day free trial</p>
        </div>

        <div class="hero-visual">
            <div class="hero-system-anim" aria-hidden="true">
                <div class="hero-starfield">
                    <span class="hero-star bright" style="left:8%;top:16%;--s:2.6px;--d:4.8s;--dl:.15s"></span>
                    <span class="hero-star" style="left:16%;top:38%;--s:1.8px;--d:5.9s;--dl:1.4s"></span>
                    <span class="hero-star warm" style="left:21%;top:63%;--s:2.9px;--d:6.1s;--dl:.8s"></span>
                    <span class="hero-star" style="left:12%;top:82%;--s:1.7px;--d:5.2s;--dl:2.1s"></span>
                    <span class="hero-star" style="left:29%;top:11%;--s:1.6px;--d:4.6s;--dl:2.6s"></span>
                    <span class="hero-star warm bright" style="left:36%;top:28%;--s:3.2px;--d:6.4s;--dl:1.1s"></span>
                    <span class="hero-star" style="left:43%;top:71%;--s:1.8px;--d:5.5s;--dl:2.9s"></span>
                    <span class="hero-star" style="left:52%;top:18%;--s:1.6px;--d:5.1s;--dl:1.7s"></span>
                    <span class="hero-star warm bright" style="left:57%;top:44%;--s:2.8px;--d:6s;--dl:.45s"></span>
                    <span class="hero-star" style="left:64%;top:8%;--s:1.5px;--d:4.9s;--dl:2.2s"></span>
                    <span class="hero-star" style="left:71%;top:31%;--s:1.9px;--d:5.7s;--dl:1.95s"></span>
                    <span class="hero-star" style="left:76%;top:66%;--s:1.7px;--d:5.4s;--dl:2.4s"></span>
                    <span class="hero-star warm" style="left:82%;top:52%;--s:2.7px;--d:6.2s;--dl:.9s"></span>
                    <span class="hero-star" style="left:88%;top:22%;--s:1.6px;--d:5.6s;--dl:3.1s"></span>
                    <span class="hero-star bright" style="left:92%;top:77%;--s:3px;--d:4.7s;--dl:1.25s"></span>
                    <span class="hero-star" style="left:26%;top:92%;--s:1.5px;--d:5.3s;--dl:2.8s"></span>
                    <span class="hero-star warm bright" style="left:48%;top:86%;--s:3.1px;--d:6.3s;--dl:1.6s"></span>
                    <span class="hero-star" style="left:67%;top:89%;--s:1.7px;--d:5s;--dl:2.35s"></span>
                </div>
                <div class="hero-flow-orbit o1">
                    <span class="hero-flow-node" title="API">
                        <svg viewBox="0 0 24 24"><polyline points="16,18 22,12 16,6"/><polyline points="8,6 2,12 8,18"/></svg>
                    </span>
                    <span class="hero-flow-node n2" title="SLA">
                        <svg viewBox="0 0 24 24"><path d="M12 3l8 4.5V12c0 5-3.4 8.9-8 10-4.6-1.1-8-5-8-10V7.5L12 3z"/><path d="M9 12l2 2 4-4"/></svg>
                    </span>
                    <span class="hero-flow-node n3" title="Bot">
                        <svg viewBox="0 0 24 24"><rect x="4" y="8" width="16" height="10" rx="3"/><path d="M12 4v4"/><circle class="fill" cx="9" cy="13" r="1.2"/><circle class="fill" cx="15" cy="13" r="1.2"/></svg>
                    </span>
                    <span class="hero-flow-node n4" title="CRM">
                        <svg viewBox="0 0 24 24"><path d="M8 7h8"/><path d="M8 12h8"/><path d="M8 17h5"/><rect x="4" y="4" width="16" height="16" rx="3"/></svg>
                    </span>
                </div>
                <div class="hero-flow-orbit o2">
                    <span class="hero-flow-node" title="Mail">
                        <svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>
                    </span>
                    <span class="hero-flow-node n2" title="Chat">
                        <svg viewBox="0 0 24 24"><path d="M21 12a8 8 0 0 1-8 8H7l-4 3v-7a8 8 0 1 1 18-4z"/></svg>
                    </span>
                    <span class="hero-flow-node n3" title="Kanban">
                        <svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M8 9v6"/><path d="M12 9v3"/><path d="M16 9v8"/></svg>
                    </span>
                    <span class="hero-flow-node n4" title="Webhook">
                        <svg viewBox="0 0 24 24"><path d="M9 7a4 4 0 0 1 7 2"/><path d="M15 17a4 4 0 0 1-7-2"/><path d="M8 13a4 4 0 0 1-2-7"/><path d="M16 11a4 4 0 0 1 2 7"/></svg>
                    </span>
                </div>
                <div class="hero-flow-orbit o3">
                    <span class="hero-flow-node" title="Flow">
                        <svg viewBox="0 0 24 24"><path d="M3 7h7v5H3z"/><path d="M14 4h7v5h-7z"/><path d="M14 15h7v5h-7z"/><path d="M10 9h4v2h-4z"/><path d="M10 13h4v2h-4z"/></svg>
                    </span>
                    <span class="hero-flow-node n2" title="Sync">
                        <svg viewBox="0 0 24 24"><path d="M21 12a9 9 0 0 1-15.5 6.4"/><path d="M3 12a9 9 0 0 1 15.5-6.4"/><polyline points="6,18 5,14 9,14"/><polyline points="18,6 19,10 15,10"/></svg>
                    </span>
                </div>
                <div class="hero-flow-core-dot"></div>
                <div class="hero-connector c1" style="--a:-20deg;--r:130px;--d:.1s">
                    <span class="dot-start"></span>
                    <span class="dot-end"></span>
                </div>
                <div class="hero-connector ccw c2" style="--a:84deg;--r:178px;--d:.9s">
                    <span class="dot-start"></span>
                    <span class="dot-end"></span>
                </div>
                <div class="hero-connector c3" style="--a:210deg;--r:236px;--d:1.6s">
                    <span class="dot-start"></span>
                    <span class="dot-end"></span>
                </div>
                <div class="hero-flow-hub" aria-hidden="true">
                    <svg viewBox="35 30 100 104" xmlns="http://www.w3.org/2000/svg">
                        <path class="b" d="m130.3 61.9c-4.4 4.4-10.6 6-16.2 4.8l-0.1 0.1c-5.9-1.1-12.3 0.6-16.9 5.2-4.5 4.5-6.2 10.7-5.3 16.5 1.3 5.8-0.2 12.1-4.7 16.6-7 6.9-18.3 6.9-25.2 0-7-7-7-18.3 0-25.2 4.8-4.8 11.6-6.3 17.6-4.5 5.6 0.6 11.3-1.2 15.6-5.4 4.6-4.6 6.3-11 5.2-16.9-1.3-5.8 0.3-12 4.8-16.4 6.9-7 18.2-7 25.2 0 6.9 6.9 6.9 18.2 0 25.2zm-6.1-12.6c0-3.6-2.9-6.5-6.4-6.5-3.6 0-6.5 2.9-6.5 6.5 0 3.6 2.9 6.5 6.5 6.5 3.5 0 6.4-2.9 6.4-6.5z"/>
                        <path class="a" d="m119 77.5c-4.6-4.6-12.1-4.6-16.7 0.1-2.9 2.9-4 6.9-3.2 10.6 1.3 7.8-1 16.1-7 22.1-9.8 9.8-25.7 9.8-35.4 0-9.8-9.8-9.8-25.7 0-35.4 6-6 14.2-8.4 22-7q0.2 0 0.4 0.1 0.1 0 0.2 0c3.6 0.5 7.3-0.6 10.1-3.3 4.6-4.6 4.6-12.1 0-16.7-1.8-1.8-4.1-2.9-6.4-3.3-15.1-2.7-31.3 1.8-43 13.5-19 19-19 49.8 0 68.8 19 19 49.8 19 68.8 0 11.4-11.5 15.9-27.2 13.6-42-0.2-2.7-1.3-5.4-3.4-7.5z"/>
                    </svg>
                </div>
            </div>
        </div>
    </div>

    <!-- Dashboard mockup -->
    <div class="hero-mockup">
        <div class="mockup-frame">
            <div class="mockup-bar">
                <div class="mockup-dots"><span></span><span></span><span></span></div>
                <div class="mockup-url">app.channelinker.com/dashboard</div>
            </div>
            <div class="dash-inner">
                <div class="dash-stats">
                    <div class="dash-stat-card">
                        <div class="dash-stat-icon" style="color:var(--purple)">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>
                        </div>
                        <div class="dash-stat-val">24</div>
                        <div class="dash-stat-label">Open Tickets</div>
                    </div>
                    <div class="dash-stat-card">
                        <div class="dash-stat-icon" style="color:var(--orange)">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>
                        </div>
                        <div class="dash-stat-val">6h 45m</div>
                        <div class="dash-stat-label">Tracked Today</div>
                    </div>
                    <div class="dash-stat-card">
                        <div class="dash-stat-icon" style="color:#22c55e">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>
                        </div>
                        <div class="dash-stat-val">94%</div>
                        <div class="dash-stat-label">Resolution Rate</div>
                    </div>
                </div>
                <div class="dash-bottom">
                    <div class="dash-card">
                        <h4>Recent Tickets</h4>
                        <div class="ticket-row">
                            <span class="tk-id">TK-1024</span>
                            <span class="tk-title">API integration issue</span>
                            <span class="tk-time">2h 15m</span>
                            <span class="tk-icon tk-purple">â±</span>
                        </div>
                        <div class="ticket-row">
                            <span class="tk-id">TK-1023</span>
                            <span class="tk-title">User login error</span>
                            <span class="tk-time">1h 30m</span>
                            <span class="tk-icon tk-orange">â±</span>
                        </div>
                        <div class="ticket-row">
                            <span class="tk-id">TK-1022</span>
                            <span class="tk-title">Dashboard loading slowly</span>
                            <span class="tk-time">45m</span>
                            <span class="tk-icon tk-green">âœ“</span>
                        </div>
                    </div>
                    <div class="dash-card">
                        <h4>Time Tracker</h4>
                        <div class="timer-display">02:34:17</div>
                        <div class="timer-label">API Development Project</div>
                        <div class="timer-bar"><div class="timer-fill"></div></div>
                        <div class="timer-goal">Daily goal: 6/8 hours</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
<div class="trust-bar">
    <p class="trust-label">Trusted by teams worldwide</p>
    <div class="trust-track-wrapper">
        <div class="trust-track">
            <span class="trust-logo">TEKNOSA</span>
            <span class="trust-logo">MEDIAMARKT</span>
            <span class="trust-logo">GETIR</span>
            <span class="trust-logo">BOYNER</span>
            <span class="trust-logo">KOTON</span>
            <span class="trust-logo">TURKCELL</span>
            <span class="trust-logo">HEPSIBURADA</span>
            <span class="trust-logo">TRENDYOL</span>
            <!-- duplicate for seamless loop -->
            <span class="trust-logo">TEKNOSA</span>
            <span class="trust-logo">MEDIAMARKT</span>
            <span class="trust-logo">GETIR</span>
            <span class="trust-logo">BOYNER</span>
            <span class="trust-logo">KOTON</span>
            <span class="trust-logo">TURKCELL</span>
            <span class="trust-logo">HEPSIBURADA</span>
            <span class="trust-logo">TRENDYOL</span>
        </div>
    </div>
</div>
<section class="section features-section" id="features">
    <div style="text-align:center;margin-bottom:0">
        <div class="eyebrow reveal">FEATURES</div>
        <h2 class="section-title reveal reveal-delay-1">Everything you need, under one roof</h2>
        <p class="section-sub reveal reveal-delay-2" style="margin:0 auto">Simplify your support processes and time management with powerful tools.</p>
    </div>
    <div class="features-grid">
        <div class="feat-card reveal">
            <div class="feat-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="3" width="20" height="18" rx="3"/><path d="M8 10h8M8 14h5"/><circle cx="5" cy="7" r="1" fill="currentColor"/></svg>
            </div>
            <h3>Smart Ticketing</h3>
            <p>Easily organize, prioritize, and auto-route customer requests to the right team.</p>
        </div>
        <div class="feat-card reveal reveal-delay-1">
            <div class="feat-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>
            </div>
            <h3>Time Tracking</h3>
            <p>Clockify-style project-based time tracking. Know exactly how long each task takes.</p>
        </div>
        <div class="feat-card reveal reveal-delay-2">
            <div class="feat-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>
            </div>
            <h3>Reporting & Analytics</h3>
            <p>Visualize your team's performance with detailed analytics and productivity dashboards.</p>
        </div>
        <div class="feat-card reveal reveal-delay-3">
            <div class="feat-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
            </div>
            <h3>Knowledge Base</h3>
            <p>Create self-service documentation for your customers. Reduce support load by 40%.</p>
        </div>
    </div>
</section>

<!-- â”€â”€â”€ INTEGRATIONS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ -->
<section class="section integrations-section" id="integrations" style="padding-top:0">
    <div style="text-align:center">
        <div class="eyebrow reveal">INTEGRATIONS</div>
        <h2 class="section-title reveal reveal-delay-1">Fully compatible with modern stacks</h2>
        <p class="section-sub reveal reveal-delay-2" style="margin:0 auto">Integrate with your existing infrastructure in minutes.</p>
    </div>
    <div class="int-grid">
        <div class="int-card reveal">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><polyline points="16,18 22,12 16,6"/><polyline points="8,6 2,12 8,18"/></svg>
            <h4>React</h4>
            <p>Modern frontend</p>
        </div>
        <div class="int-card reveal reveal-delay-1">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
            <h4>Laravel</h4>
            <p>Backend API</p>
        </div>
        <div class="int-card reveal reveal-delay-2">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            <h4>REST API</h4>
            <p>Full integration</p>
        </div>
    </div>
</section>

<!-- EXTRA FEATURE SPOTLIGHT -->
<section class="section spotlight-section">
    <div style="text-align:center">
        <div class="eyebrow reveal">FEATURES</div>
        <h2 class="section-title reveal reveal-delay-1">Everything You <span style="color:var(--purple-light)">Need</span> to Close More Deals</h2>
    </div>
    <div class="spotlight-grid">
        <div class="spotlight-card reveal">
            <div class="spotlight-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M8 7h8"/><path d="M6 11h12"/><path d="M9 15h6"/><rect x="3" y="4" width="18" height="16" rx="4"/></svg>
            </div>
            <h3>Real-Time AI Collaboration</h3>
            <p>Assign tasks, share notes, and collaborate seamlessly to keep your team aligned and productive.</p>
            <div class="ai-chat-demo">
                <div class="chat-row">
                    <span class="chat-badge">AI</span>
                    <span class="chat-msg">Hi! How can we help you today?</span>
                </div>
                <div class="chat-row user">
                    <span class="chat-msg">I need an update on my request.</span>
                    <span class="chat-badge">U</span>
                </div>
                <div class="chat-row">
                    <span class="chat-badge">AI</span>
                    <span class="chat-msg">Sure, here is the latest status.</span>
                </div>
                <div class="chat-row user">
                    <span class="chat-msg">Thanks, that helps a lot!</span>
                    <span class="chat-badge">U</span>
                </div>
            </div>
        </div>
        <div class="spotlight-card reveal reveal-delay-1">
            <div class="spotlight-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 18V6"/><path d="M9 18V10"/><path d="M14 18V8"/><path d="M19 18v-5"/><path d="M4 18h16"/></svg>
            </div>
            <h3>Real-Time Analytics</h3>
            <p>Get instant insights into your business performance, track conversions, monitor revenue, and make data-driven decisions quickly.</p>
            <div class="analytics-mini">
                <div class="analytics-head">
                    <strong>Analytics</strong>
                    <span class="analytics-chip">+$3,722 · 7.2%</span>
                </div>
                <svg class="analytics-svg" viewBox="0 0 400 130" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <defs>
                        <linearGradient id="anaFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stop-color="#6ed8bf" stop-opacity=".28" />
                            <stop offset="100%" stop-color="#6ed8bf" stop-opacity=".02" />
                        </linearGradient>
                    </defs>
                    <path class="analytics-axis" d="M12 104H388"/>
                    <path class="analytics-axis" d="M12 72H388"/>
                    <path class="analytics-axis" d="M12 40H388"/>
                    <path class="analytics-fill" d="M12 94C35 102 55 110 73 95C90 78 108 42 127 50C145 58 165 94 184 86C206 78 220 40 241 49C260 57 279 84 298 72C319 58 341 43 388 62V130H12Z"/>
                    <path class="analytics-line" d="M12 94C35 102 55 110 73 95C90 78 108 42 127 50C145 58 165 94 184 86C206 78 220 40 241 49C260 57 279 84 298 72C319 58 341 43 388 62"/>
                    <circle class="analytics-dot" cx="241" cy="49" r="5"/>
                </svg>
            </div>
        </div>

        <div class="spotlight-card reveal reveal-delay-2">
            <div class="spotlight-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 7h12"/><path d="M4 11h16"/><path d="M8 15h8"/><rect x="3" y="4" width="18" height="16" rx="4"/></svg>
            </div>
            <h3>Lead Management</h3>
            <p>Capture, organize, and prioritize leads efficiently with automated pipelines that streamline follow-ups and boost conversions.</p>
            <div class="spotlist">
                <div class="spotrow"><div><strong>Alex Thompson</strong><span> · New lead from chat</span></div><small>2m</small></div>
                <div class="spotrow"><div><strong>Mia Roberts</strong><span> · Proposal requested</span></div><small>18m</small></div>
                <div class="spotrow"><div><strong>Daniel Kent</strong><span> · Qualified (High)</span></div><small>1h</small></div>
            </div>
        </div>

        <div class="spotlight-card reveal reveal-delay-3">
            <div class="spotlight-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/><path d="M11 8v6M8 11h6"/></svg>
            </div>
            <h3>Seamless Integration</h3>
            <p>Integrate Channelinker easily with your tools to streamline workflows and enhance collaboration across teams.</p>
            <div class="mini-orbit-wrap">
                <div class="mini-orbit-ring outer">
                    <span class="mini-orbit-node" style="--a:0deg;--r:99px">S</span>
                    <span class="mini-orbit-node" style="--a:60deg;--r:99px">Z</span>
                    <span class="mini-orbit-node" style="--a:120deg;--r:99px">M</span>
                    <span class="mini-orbit-node" style="--a:180deg;--r:99px">G</span>
                    <span class="mini-orbit-node" style="--a:240deg;--r:99px">N</span>
                    <span class="mini-orbit-node" style="--a:300deg;--r:99px">A</span>
                </div>
                <div class="mini-orbit-ring inner">
                    <span class="mini-orbit-node" style="--a:30deg;--r:62px">R</span>
                    <span class="mini-orbit-node" style="--a:120deg;--r:62px">L</span>
                    <span class="mini-orbit-node" style="--a:210deg;--r:62px">T</span>
                    <span class="mini-orbit-node" style="--a:300deg;--r:62px">C</span>
                </div>
                <div class="mini-orbit-center" aria-hidden="true">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="28 28 112 112">
                        <path class="b" fill-rule="evenodd" d="m130.3 61.9c-4.4 4.4-10.6 6-16.2 4.8l-0.1 0.1c-5.9-1.1-12.3 0.6-16.9 5.2-4.5 4.5-6.2 10.7-5.3 16.5 1.3 5.8-0.2 12.1-4.7 16.6-7 6.9-18.3 6.9-25.2 0-7-7-7-18.3 0-25.2 4.8-4.8 11.6-6.3 17.6-4.5 5.6 0.6 11.3-1.2 15.6-5.4 4.6-4.6 6.3-11 5.2-16.9-1.3-5.8 0.3-12 4.8-16.4 6.9-7 18.2-7 25.2 0 6.9 6.9 6.9 18.2 0 25.2zm-6.1-12.6c0-3.6-2.9-6.5-6.4-6.5-3.6 0-6.5 2.9-6.5 6.5 0 3.6 2.9 6.5 6.5 6.5 3.5 0 6.4-2.9 6.4-6.5z"/>
                        <path class="a" d="m119 77.5c-4.6-4.6-12.1-4.6-16.7 0.1-2.9 2.9-4 6.9-3.2 10.6 1.3 7.8-1 16.1-7 22.1-9.8 9.8-25.7 9.8-35.4 0-9.8-9.8-9.8-25.7 0-35.4 6-6 14.2-8.4 22-7q0.2 0 0.4 0.1 0.1 0 0.2 0c3.6 0.5 7.3-0.6 10.1-3.3 4.6-4.6 4.6-12.1 0-16.7-1.8-1.8-4.1-2.9-6.4-3.3-15.1-2.7-31.3 1.8-43 13.5-19 19-19 49.8 0 68.8 19 19 49.8 19 68.8 0 11.4-11.5 15.9-27.2 13.6-42-0.2-2.7-1.3-5.4-3.4-7.5z"/>
                    </svg>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- DASHBOARD SHOWCASE -->
<section class="section dash-plus-section">
    <div class="dash-plus-wrap reveal">
        <div class="dash-plus-inner">
            <div class="dash-plus-top">
                <h3>Dashboard</h3>
                <span class="dash-plus-chip">Realtime workspace</span>
            </div>
            <div class="dash-plus-grid">
                <div class="dash-plus-card">
                    <div class="mini-metrics">
                        <div class="mini-metric"><strong>$32,912</strong><span>Accepted</span></div>
                        <div class="mini-metric"><strong>$16.2k</strong><span>Pending</span></div>
                        <div class="mini-metric"><strong>$18,680</strong><span>Revenue</span></div>
                    </div>
                    <div class="mini-chart">
                        <svg class="chart-line" viewBox="0 0 400 170" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 130H392" stroke="rgba(120,110,160,.25)"/>
                            <path d="M8 92H392" stroke="rgba(120,110,160,.18)"/>
                            <path d="M8 54H392" stroke="rgba(120,110,160,.12)"/>
                            <path d="M8 120C35 132 56 140 78 119C96 101 115 59 137 77C155 92 177 128 201 103C225 79 238 45 257 67C278 90 299 95 320 84C339 73 356 50 392 63" stroke="#40c2a0" stroke-width="4" stroke-linecap="round"/>
                        </svg>
                    </div>
                </div>
                <div class="dash-plus-card">
                    <div class="activity-list">
                        <div class="activity-item"><div><b>Payflow</b><small> Today 7:18 AM</small></div><em>+$1,223</em></div>
                        <div class="activity-item"><div><b>Coinly</b><small> Yesterday</small></div><em>+$1,700</em></div>
                        <div class="activity-item"><div><b>Stripe</b><small> 2 days ago</small></div><em>+$860</em></div>
                        <div class="activity-item"><div><b>Revenue Goal</b><small> This month</small></div><em>79%</em></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- FAQ -->
<section class="section faq-section" id="faq">
    <div class="faq-grid">
        <div class="reveal">
            <div class="faq-kicker">✶ FAQ</div>
            <h2 class="faq-title">Frequently Asked <span>Questions</span></h2>
            <p class="faq-desc">In this section, we answer common questions about ticketing, integrations, pricing, and support so your team can get value quickly.</p>
        </div>
        <div class="faq-list reveal reveal-delay-1">
            <div class="faq-item open">
                <button class="faq-toggle" aria-expanded="true">
                    What is Channelinker Ticketing Hub?
                    <span class="faq-ic">↑</span>
                </button>
                <div class="faq-answer">
                    Channelinker is an all-in-one platform for ticket operations, team collaboration, and time tracking with analytics-ready workflows.
                </div>
            </div>
            <div class="faq-item">
                <button class="faq-toggle" aria-expanded="false">
                    Can I integrate Channelinker with other tools?
                    <span class="faq-ic">↓</span>
                </button>
                <div class="faq-answer">
                    Yes. You can connect via API and webhooks, and sync your existing stack to keep customer, ticket, and performance data in one flow.
                </div>
            </div>
            <div class="faq-item">
                <button class="faq-toggle" aria-expanded="false">
                    Is there a free trial period?
                    <span class="faq-ic">↓</span>
                </button>
                <div class="faq-answer">
                    Absolutely. You can start with a 14-day free trial and upgrade when your team is ready.
                </div>
            </div>
            <div class="faq-item">
                <button class="faq-toggle" aria-expanded="false">
                    Does it support multi-team workflows?
                    <span class="faq-ic">↓</span>
                </button>
                <div class="faq-answer">
                    Yes. You can manage multiple teams, assign role-based access, and report progress by team, project, or channel.
                </div>
            </div>
        </div>
    </div>
</section>

<!-- â”€â”€â”€ PRICING â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ -->
<section class="section pricing-section" id="pricing" style="background:var(--bg)">
    <div style="text-align:center">
        <div class="eyebrow reveal">PRICING</div>
        <h2 class="section-title reveal reveal-delay-1">Choose the plan that fits your team</h2>
        <p class="section-sub reveal reveal-delay-2" style="margin:0 auto">Try free for 14 days, cancel anytime.</p>
    </div>
    <div class="pricing-grid">
        <!-- Starter -->
        <div class="price-card reveal">
            <div class="price-tier">Starter</div>
            <div class="price-sub-desc">Perfect for small teams</div>
            <div class="price-amount"><sup>$</sup>29<span class="mo">/mo</span></div>
            <div class="price-divider"></div>
            <ul class="price-features">
                <li><svg class="check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20,6 9,17 4,12"/></svg> Up to 5 users</li>
                <li><svg class="check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20,6 9,17 4,12"/></svg> Basic ticketing</li>
                <li><svg class="check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20,6 9,17 4,12"/></svg> Time tracking</li>
                <li><svg class="check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20,6 9,17 4,12"/></svg> Email support</li>
                <li><svg class="check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20,6 9,17 4,12"/></svg> 1 GB storage</li>
            </ul>
            <button class="price-btn">Get Started</button>
        </div>
        <!-- Professional -->
        <div class="price-card featured reveal reveal-delay-1">
            <div class="price-tier">Professional</div>
            <div class="price-sub-desc">Most popular for growing teams</div>
            <div class="price-amount"><sup>$</sup>69<span class="mo">/mo</span></div>
            <div class="price-divider"></div>
            <ul class="price-features">
                <li><svg class="check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20,6 9,17 4,12"/></svg> Up to 25 users</li>
                <li><svg class="check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20,6 9,17 4,12"/></svg> Advanced ticketing &amp; SLA</li>
                <li><svg class="check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20,6 9,17 4,12"/></svg> Detailed time tracking</li>
                <li><svg class="check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20,6 9,17 4,12"/></svg> Knowledge base</li>
                <li><svg class="check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20,6 9,17 4,12"/></svg> Reporting &amp; analytics</li>
                <li><svg class="check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20,6 9,17 4,12"/></svg> API access</li>
                <li><svg class="check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20,6 9,17 4,12"/></svg> 10 GB storage</li>
            </ul>
            <button class="price-btn">Get Started</button>
        </div>
        <!-- Enterprise -->
        <div class="price-card reveal reveal-delay-2">
            <div class="price-tier">Enterprise</div>
            <div class="price-sub-desc">For large organizations</div>
            <div class="price-amount"><sup>$</sup>149<span class="mo">/mo</span></div>
            <div class="price-divider"></div>
            <ul class="price-features">
                <li><svg class="check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20,6 9,17 4,12"/></svg> Unlimited users</li>
                <li><svg class="check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20,6 9,17 4,12"/></svg> All Professional features</li>
                <li><svg class="check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20,6 9,17 4,12"/></svg> Custom integrations</li>
                <li><svg class="check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20,6 9,17 4,12"/></svg> Priority support</li>
                <li><svg class="check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20,6 9,17 4,12"/></svg> SSO &amp; SAML</li>
                <li><svg class="check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20,6 9,17 4,12"/></svg> Unlimited storage</li>
                <li><svg class="check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20,6 9,17 4,12"/></svg> Custom SLA</li>
            </ul>
            <button class="price-btn">Get Started</button>
        </div>
    </div>
</section>

<!-- â”€â”€â”€ FOOTER â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ -->
<footer>
    <div class="footer-cursor-glow" aria-hidden="true"></div>
    <div class="footer-shell">
        <div class="footer-cta">
            <div class="footer-kicker">LET'S GROW TOGETHER</div>
            <h2 class="footer-title">
                Ready to Start Your<br />
                <span class="journey-pill">Support Journey?</span>
            </h2>
            <p class="footer-cta-copy">
                Experience Channelinker firsthand. Request a free demo or connect with our team to launch your support operation with faster response times and clearer workflows.
            </p>
            <div class="footer-cta-actions">
                <a class="footer-btn footer-btn-primary" href="/register">
                    Contact Sales
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/></svg>
                </a>
                <a class="footer-btn footer-btn-secondary" href="#features">Why Channelinker?</a>
            </div>
        </div>

        <div class="footer-links">
            <div class="footer-col">
                <h5>SOLUTIONS</h5>
                <ul>
                    <li><a href="#">Ticket Operations</a></li>
                    <li><a href="#">Team Workflows</a></li>
                    <li><a href="#">Knowledge Base</a></li>
                    <li><a href="#">Support Automation</a></li>
                </ul>
            </div>
            <div class="footer-col">
                <h5>INTEGRATIONS</h5>
                <ul>
                    <li><a href="#">Channels</a></li>
                    <li><a href="#">API & Webhooks</a></li>
                    <li><a href="#">CRM Sync</a></li>
                    <li><a href="#">Cross-platform Access</a></li>
                </ul>
            </div>
            <div class="footer-col">
                <h5>WHY CHANNELINKER</h5>
                <ul>
                    <li><a href="#">Faster Resolution</a></li>
                    <li><a href="#">Customer Stories</a></li>
                    <li><a href="#">Customizable Flows</a></li>
                    <li><a href="#">Service Visibility</a></li>
                </ul>
            </div>
            <div class="footer-col">
                <h5>COMPANY</h5>
                <ul>
                    <li><a href="#">About Us</a></li>
                    <li><a href="#">Partners</a></li>
                    <li><a href="#">Careers</a></li>
                    <li><a href="#">Contact</a></li>
                </ul>
            </div>
            <div class="footer-col">
                <h5>RESOURCES</h5>
                <ul>
                    <li><a href="#">Blog & News</a></li>
                    <li><a href="#faq">Frequently Asked Questions</a></li>
                    <li><a href="#">Customer Support</a></li>
                    <li><a href="#">Documentation</a></li>
                </ul>
            </div>
        </div>

        <div class="footer-bottom">
            <p>&copy; 2026 Channelinker. All rights reserved.</p>
            <p class="footer-legal">
                <a href="/privacy-policy">Privacy Policy</a> &bull; <a href="/terms-of-service">Terms of Service</a>
            </p>
            <p class="footer-legal">This content is protected by applicable copyright laws. Channelinker and its logo are registered trademarks.</p>
        </div>
    </div>
</footer>
;

`;

function PublicLiveChatWidget(): JSX.Element {
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState('');
    const [sending, setSending] = useState(false);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [visitorToken, setVisitorToken] = useState<string | null>(null);
    const [messages, setMessages] = useState<Array<{
        id: number;
        body: string;
        created_at: string;
        is_visitor: boolean;
    }>>([]);
    const reloadInFlightRef = useRef(false);

    const scheduleHistoryReload = () => {
        if (reloadInFlightRef.current) {
            return;
        }

        reloadInFlightRef.current = true;

        void loadHistory().finally(() => {
            reloadInFlightRef.current = false;
        });
    };

    const loadHistory = async () => {
        setLoadingHistory(true);

        try {
            const response = await fetch(`/live-chat/messages?_=${Date.now()}`, {
                method: 'GET',
                cache: 'no-store',
                credentials: 'same-origin',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to load history: ${response.status}`);
            }

            const payload = await response.json();
            setVisitorToken(typeof payload.visitor_token === 'string' ? payload.visitor_token : null);
            setMessages(Array.isArray(payload.data) ? payload.data : []);
        } catch (error) {
            console.error('Failed to load live chat history', error);
        } finally {
            setLoadingHistory(false);
        }
    };

    useEffect(() => {
        if (open) {
            void loadHistory();
        }
    }, [open]);

    useEffect(() => {
        if (!open || !visitorToken || !(window as any).Echo) {
            return;
        }

        const channelName = `livechat.visitor.${visitorToken}`;
        const echo = (window as any).Echo;
        const channel = echo.channel(channelName);
        const rawChannel =
            echo.connector?.pusher?.channel(channelName) ??
            echo.connector?.pusher?.subscribe(channelName);

        const handleMessageSent = () => {
            scheduleHistoryReload();
        };
        const handleGlobalEvent = (eventName: string) => {
            if (
                eventName === 'message.sent' ||
                eventName === '.message.sent' ||
                eventName === 'App\\Events\\MessageSent'
            ) {
                scheduleHistoryReload();
            }
        };

        channel.listen('.message.sent', handleMessageSent);
        channel.listen('message.sent', handleMessageSent);
        rawChannel?.bind?.('.message.sent', handleMessageSent);
        rawChannel?.bind?.('message.sent', handleMessageSent);
        rawChannel?.bind?.('App\\Events\\MessageSent', handleMessageSent);
        rawChannel?.bind_global?.(handleGlobalEvent);

        return () => {
            channel.stopListening?.('.message.sent');
            channel.stopListening?.('message.sent');
            rawChannel?.unbind?.('.message.sent', handleMessageSent);
            rawChannel?.unbind?.('message.sent', handleMessageSent);
            rawChannel?.unbind?.('App\\Events\\MessageSent', handleMessageSent);
            rawChannel?.unbind_global?.(handleGlobalEvent);
            echo.leave(channelName);
        };
    }, [open, visitorToken]);

    const sendMessage = async (event: FormEvent) => {
        event.preventDefault();
        const body = input.trim();
        if (!body || sending) {
            return;
        }

        setSending(true);
        try {
            const csrfToken = document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute('content') ?? '';
            const socketId = (window as any).Echo?.socketId?.();

            const response = await fetch('/live-chat/message', {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest',
                    ...(socketId ? { 'X-Socket-Id': socketId } : {}),
                },
                body: JSON.stringify({ body }),
            });

            if (!response.ok) {
                throw new Error(`Failed to send message: ${response.status}`);
            }

            const payload = await response.json();
            if (typeof payload.visitor_token === 'string' && payload.visitor_token.length > 0) {
                setVisitorToken(payload.visitor_token);
            }

            setInput('');
            await loadHistory();
        } catch (error) {
            // Keep UX simple on homepage widget.
            console.error('Failed to send live chat message', error);
        } finally {
            setSending(false);
        }
    };

    return (
        <div style={{ position: 'fixed', right: 24, bottom: 24, zIndex: 200 }}>
            {open ? (
                <div
                    style={{
                        width: 320,
                        borderRadius: 14,
                        border: '1px solid rgba(74,222,190,.35)',
                        background: 'var(--surface)',
                        boxShadow: 'var(--shadow-lg)',
                        overflow: 'hidden',
                    }}
                >
                    <div
                        style={{
                            padding: '10px 12px',
                            background: 'var(--purple)',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            fontWeight: 700,
                        }}
                    >
                        <span>Live Chat</span>
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}
                        >
                            Close
                        </button>
                    </div>
                    <div style={{ maxHeight: 220, overflowY: 'auto', padding: 12, display: 'grid', gap: 8 }}>
                        {loadingHistory ? (
                            <div style={{ color: 'var(--text2)', fontSize: 13 }}>
                                Loading conversation...
                            </div>
                        ) : messages.length === 0 ? (
                            <div style={{ color: 'var(--text2)', fontSize: 13 }}>
                                Send a message to start chatting with us.
                            </div>
                        ) : (
                            messages.map((message) => (
                                <div
                                    key={message.id}
                                    style={{
                                        background: message.is_visitor ? 'rgba(74,222,190,.12)' : 'var(--bg2)',
                                        border: message.is_visitor
                                            ? '1px solid rgba(74,222,190,.2)'
                                            : '1px solid var(--border)',
                                        borderRadius: 10,
                                        padding: '8px 10px',
                                        color: 'var(--text)',
                                        fontSize: 13,
                                        justifySelf: message.is_visitor ? 'end' : 'start',
                                        maxWidth: '88%',
                                    }}
                                >
                                    {message.body}
                                </div>
                            ))
                        )}
                    </div>
                    <form onSubmit={sendMessage} style={{ display: 'flex', gap: 8, padding: 12, borderTop: '1px solid var(--border)' }}>
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your message..."
                            style={{
                                flex: 1,
                                border: '1px solid var(--border)',
                                borderRadius: 10,
                                padding: '9px 10px',
                                background: 'var(--bg2)',
                                color: 'var(--text)',
                            }}
                        />
                        <button
                            type="submit"
                            disabled={sending || !input.trim()}
                            style={{
                                border: 'none',
                                borderRadius: 10,
                                padding: '0 12px',
                                fontWeight: 700,
                                background: 'var(--purple)',
                                color: '#fff',
                                cursor: 'pointer',
                            }}
                        >
                            Send
                        </button>
                    </form>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    style={{
                        border: 'none',
                        borderRadius: 999,
                        padding: '12px 16px',
                        fontWeight: 700,
                        background: 'var(--purple)',
                        color: '#fff',
                        boxShadow: '0 8px 24px rgba(64,194,160,.32)',
                        cursor: 'pointer',
                    }}
                >
                    Live Chat
                </button>
            )}
        </div>
    );
}

export default function Welcome(): JSX.Element {
    useEffect(() => {
        const html = document.documentElement;
        const btn = document.getElementById('themeToggle');
        const nav = document.getElementById('navbar');
        const navLinks = document.querySelectorAll<HTMLAnchorElement>('.nav-links a');
        const smoothLinks = document.querySelectorAll<HTMLAnchorElement>('.nav-links a[href^="#"]');
        const faqToggles = document.querySelectorAll<HTMLButtonElement>('.faq-toggle');
        const footer = document.querySelector<HTMLElement>('footer');
        const sections = ['features', 'integrations', 'pricing']
            .map((id) => document.getElementById(id))
            .filter((section): section is HTMLElement => section !== null);
        const navLogo = document.querySelector<HTMLElement>('.logo-svg-nav');
        const footerLogo = document.querySelector<HTMLElement>('.logo-svg-footer');
        if (navLogo) navLogo.innerHTML = loginLogoSvg;
        if (footerLogo) footerLogo.innerHTML = loginLogoSvg;

        const applyTheme = (theme: 'light' | 'dark') => {
            html.setAttribute('data-theme', theme);
            localStorage.setItem('cl-theme', theme);
        };

        const handleThemeToggle = () => {
            const currentTheme = html.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
            applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
        };

        const handleNavScroll = () => {
            nav?.classList.toggle('scrolled', window.scrollY > 20);
        };

        const setActiveLink = () => {
            const scrollPos = window.scrollY + 100;
            let current = '';

            sections.forEach((section) => {
                if (section.offsetTop <= scrollPos) {
                    current = section.id;
                }
            });

            navLinks.forEach((link) => {
                link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
            });
        };

        const handleSmoothScroll = (event: Event) => {
            event.preventDefault();

            const link = event.currentTarget as HTMLAnchorElement;
            const href = link.getAttribute('href');
            if (!href) {
                return;
            }

            const target = document.querySelector<HTMLElement>(href);
            if (!target) {
                return;
            }

            const offset = 72;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        };

        const handleFaqToggle = (event: Event) => {
            const button = event.currentTarget as HTMLButtonElement;
            const item = button.closest('.faq-item');
            if (!item) {
                return;
            }

            const isOpen = item.classList.contains('open');
            document.querySelectorAll('.faq-item').forEach((faqItem) => {
                faqItem.classList.remove('open');
                const faqButton = faqItem.querySelector<HTMLButtonElement>('.faq-toggle');
                const faqIcon = faqItem.querySelector<HTMLElement>('.faq-ic');
                if (faqButton) {
                    faqButton.setAttribute('aria-expanded', 'false');
                }
                if (faqIcon) {
                    faqIcon.textContent = '↓';
                }
            });

            if (!isOpen) {
                item.classList.add('open');
                button.setAttribute('aria-expanded', 'true');
                const icon = item.querySelector<HTMLElement>('.faq-ic');
                if (icon) {
                    icon.textContent = '↑';
                }
            }
        };

        const handleFooterMove = (event: MouseEvent) => {
            if (!footer) {
                return;
            }
            const rect = footer.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            footer.style.setProperty('--mx', `${x}px`);
            footer.style.setProperty('--my', `${y}px`);
            footer.style.setProperty('--footer-glow-opacity', '1');
        };

        const handleFooterEnter = () => {
            footer?.style.setProperty('--footer-glow-opacity', '1');
        };

        const handleFooterLeave = () => {
            footer?.style.setProperty('--footer-glow-opacity', '0');
        };

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1 },
        );

        document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

        const savedTheme = localStorage.getItem('cl-theme');
        if (savedTheme === 'light' || savedTheme === 'dark') {
            applyTheme(savedTheme);
        } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            applyTheme('dark');
        } else {
            applyTheme('light');
        }

        btn?.addEventListener('click', handleThemeToggle);
        window.addEventListener('scroll', handleNavScroll);
        window.addEventListener('scroll', setActiveLink);
        smoothLinks.forEach((link) => link.addEventListener('click', handleSmoothScroll));
        faqToggles.forEach((toggle) => toggle.addEventListener('click', handleFaqToggle));
        footer?.addEventListener('mousemove', handleFooterMove);
        footer?.addEventListener('mouseenter', handleFooterEnter);
        footer?.addEventListener('mouseleave', handleFooterLeave);
        handleNavScroll();
        setActiveLink();

        return () => {
            btn?.removeEventListener('click', handleThemeToggle);
            window.removeEventListener('scroll', handleNavScroll);
            window.removeEventListener('scroll', setActiveLink);
            smoothLinks.forEach((link) => link.removeEventListener('click', handleSmoothScroll));
            faqToggles.forEach((toggle) => toggle.removeEventListener('click', handleFaqToggle));
            footer?.removeEventListener('mousemove', handleFooterMove);
            footer?.removeEventListener('mouseenter', handleFooterEnter);
            footer?.removeEventListener('mouseleave', handleFooterLeave);
            observer.disconnect();
        };
    }, []);

    return (
        <>
            <Head title="Channelinker - Ticketing Hub">
                <link
                    href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;900&display=swap"
                    rel="stylesheet"
                />
            </Head>

            <style dangerouslySetInnerHTML={{ __html: styles }} />
            <div className="welcome-page" dangerouslySetInnerHTML={{ __html: markup }} />
            <PublicLiveChatWidget />
        </>
    );
}




