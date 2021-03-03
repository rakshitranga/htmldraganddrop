let elements;
let options;
var clickedElement;
let textTags = ["h1", "h2", "h3", "p", "code"];
let newTab;

$(document).ready(() => {
    $("#optionsModal").draggable({
        handle: '.modal-dialog',
        cursor: 'move'
    });

    $.get("/json/elements.json", (data) => {
        elements = data;
        for (let i in data) {
            let uiItem = $(`<li>${data[i].icon} ${data[i].name}</li>`)
                            .addClass("ui-item list-group-item")
                            .attr("name", i)
                            .attr("draggable", "true");
            $("#items-ui").append(uiItem);
        }
    })

    $.get("/json/options.json", (data) => {
        options = data; 
        for(let i in data.all) {
            $("#opts").prepend(`<li class='list-group-item option' 
                                    onclick='action("${data.all[i].action}", "${i}")'>
                                    ${data.all[i].icon} ${i}</li>`)
        } 
    })

    $(document).on('dragover', '#viewport', function(e) {
        e.preventDefault();
    });

    $(document).on('drop', '#viewport', function(e) {
        e.preventDefault();
        let element = e.originalEvent.dataTransfer.getData("text");
        if ($(element).prop("tagName") !== undefined) {
            $(this).append(element);
        }
    });

    $(document).on('click', '#viewport', function(e) {
        if (e.target != this) {
            clickedElement = [e.target, $(e.target).prop("tagName").toLowerCase()];
            console.log(clickedElement);

            $("#propsCollapse").collapse("show")
            $(".title").html(`<span class='text-capitalize text-primary'>${clickedElement[1]}</span>`)
            $(".customOption").remove();

            for(let i in options[clickedElement[1]]) {
                $("#opts").prepend(`<li class='list-group-item customOption' 
                                        onclick='action("${options[clickedElement[1]][i].action}", "${i}")'>
                                        ${options[clickedElement[1]][i].icon} ${i}</li>`)
            } 
        }
    })

    $(document).on('dblclick', "#viewport", function(e) {
        if (e.target != this) {
            let tag = $(e.target).prop("tagName").toLowerCase();

            if (textTags.includes(tag)) {
                $(e.target).attr("contenteditable", "");
            }
        }
    })

    $(document).on('focusout', "#viewport", function(e) {
        if (e.target != this) {
            $(e.target).removeAttr("contenteditable");
        }
    })

    $(document).on('dragstart', '.ui-item', function(e) {
        let name = $(this).attr("name");
        // e.transfer.setData("text", elements[name].html);
        e.originalEvent.dataTransfer.setData("text", elements[name].html);
    })

    // ====================================================================new tab (work in progress)
    $("#newTab").click(() => {
        let html = $("#viewport").html();
    
        newTab = window.open("about:blank", "_blank");
        newTab.document.write(html);

        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/js/bootstrap.bundle.min.js'; 
        
        var link = document.createElement('link');
        link.rel = "stylesheet";
        link.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css';

        newTab.document.getElementsByTagName('head')[0].appendChild(script);
        newTab.document.getElementsByTagName('head')[0].appendChild(link);
    })

    $("body").on('DOMSubtreeModified', "#viewport", function() {
        if (newTab.document) {
            let html = $("#viewport").html();
            newTab.document.body.innerHTML = (html);
        }
    });
    // ===================================================================end new tab
    
})