var cooldown = false

var char_arrow_down = "&#x23F7;";
var char_arrow_up = "&#x23F6";

var svg_up = "0,12 12,0 24,12";
var svg_down ="0,0 12,12 24,0";

var startingY = 0;

function scrollProjectWheel(event){
    let delta = event.deltaY;
    event.preventDefault();
    if(cooldown) return;
    
    var items = document.querySelectorAll('.project-title');
    
    if(delta > 10){
        items[0].parentNode.insertBefore(items[items.length-1], items[0]);
    }
    if(delta < -10){
        items[0].parentNode.append(items[0]);
    }
    cooldown = true;

    this.setTimeout(()=>{cooldown = false;}, 50);
}

function startProjectWheelMobile(event, elm){

    startingY = event.touches[0].pageY;
    elm.classList.add("touch-mobile");
}

function scrollProjectWheelMobile(event, elm){
    event.preventDefault();

    if(cooldown) return;

    let currentY = event.touches[0].pageY;
    var delta = currentY - startingY;

    var items = document.querySelectorAll('.project-title');
    
    if(delta > 10){
        items[0].parentNode.insertBefore(items[items.length-1], items[0]);
        startingY = currentY;
    }
    if(delta < -10){
        items[0].parentNode.append(items[0]);
        startingY = currentY;
    }
    cooldown = true;

    this.setTimeout(()=>{cooldown = false;}, 75);
    
}

function clearProjectWheelMobile(elm){
    elm.classList.remove("touch-mobile");
}

function collapse(title_elm, element, parent)
{
    let elm = document.querySelector('#'+element);
    let state = elm.classList.toggle("collapsed");

    if(title_elm)
    {
        if (title_elm.dataset.show)
        {
            title_elm.innerHTML = (state ? title_elm.dataset.show : title_elm.dataset.hide);
        }else{
            let arrow = title_elm.querySelector('polygon');
            arrow.setAttribute("points", (state ? svg_down : svg_up));
        }
    }

    if(parent)
    {
        let parent_elm = document.querySelector('#'+parent);
        parent_elm.classList.toggle("expand");
    }
}

function forceCollapse(element, desiredState)
{
    let elm = document.querySelector('#'+element);

    if(desiredState){
        elm.classList.remove("collapsed");
    }else{
        elm.classList.add("collapsed");
    }
}

function changeLanguage(elm)
{
    let lang = elm.dataset.lang;
    location.href = "../"+lang+"/";
}

function showProjects(show, elm){

    let overlay = document.querySelector('#overlay');
    let projectList = document.querySelector('#project-list');
    let projectBody = document.querySelector('#project-body');
    let body = document.querySelector('body');
    let mobileClose = document.querySelector('#close-projects-mobile');
    
    
    if(show){
        let type = elm.dataset.type;
        if(type != null )
        {
            updateFilterButton(type);
            filterProjects(type);
        }
        
        body.classList.add("noscroll");
        overlay.classList.remove("disabled");
        projectList.classList.remove("hidden");
        projectBody.classList.add("collapsed");
        mobileClose.classList.remove("collapsed");

        document.querySelector("#project-body #project-content").innerHTML = "";
    }
    else{
        overlay.classList.add("disabled");
        body.classList.remove("noscroll");
        mobileClose.classList.add("collapsed");
    }
}

function updateFilterButton(type)
{
    let buttons = document.querySelectorAll('#overlay .filter-list button');

    for(let i=0; i<buttons.length; i++)
    {
        if(buttons[i].dataset.type != type){
            buttons[i].classList.remove("pressed");
        }
        else{
            buttons[i].classList.add("pressed");
        }
    }
}

function filterProjects(type){
    let projects = document.querySelectorAll('#project-list .content-block');

    for(let i=0; i<projects.length; i++)
        {
            if(projects[i].dataset.type != type){
                projects[i].classList.add("hidden");
            }
            else{
                projects[i].classList.remove("hidden");
            }
        }
}

function projectSelected(project)
{
    let projectId = project.id;
    let lang = document.querySelector("html").lang;

    fetch("/"+lang+"/projects/"+projectId+".html")
    .then(data => {
      return data.text()
    })
    .then( data => {
        document.querySelector("#project-body #project-content").innerHTML = data;

        let projectList = document.querySelector('#project-list');
        projectList.classList.add("hidden");

        let projectBody = document.querySelector('#project-body');
        projectBody.classList.remove("collapsed");
    })
}