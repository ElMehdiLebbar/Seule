export const setupShadow = (element ,app)=>{
    const shadow = element.attachShadow({ mode: app.mode });
    const template = document.createElement("template");

    template.innerHTML = "<style>"+ app.style + "</style>" + app.template;
    const templateContent = template.content;
    shadow.appendChild(templateContent.cloneNode(true));
}


