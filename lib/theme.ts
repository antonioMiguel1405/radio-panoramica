export const THEME_KEY = "rp-theme";

/** Script executado antes da primeira pintura: aplica o tema salvo ou o do sistema. */
export const themeScript = `(function(){var d=false;try{var m=localStorage.getItem("${THEME_KEY}");d=m==="dark"||(m!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches)}catch(e){try{d=matchMedia("(prefers-color-scheme: dark)").matches}catch(_){}}document.documentElement.setAttribute("data-theme",d?"dark":"light")})()`;
