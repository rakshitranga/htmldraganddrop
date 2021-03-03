var optionsModal = new bootstrap.Modal($("#optionsModal")[0], {
    backdrop: false,
    keyboard: true,
    focus: true
})

let showModal = (text, optionsArray = undefined) => {
    $("#optionsModalLabel").text(text);
    if (optionsArray == undefined) {
        optionsModal.show();
        $("#optionsText").removeClass("d-none").addClass("d-block");
        $("#optionsSelect").removeClass("d-block").addClass("d-none");
        $("#optionsText").val($(clickedElement[0]).text()).focus();

        $("#save").click(() => {
            $(clickedElement[0]).text($("#optionsText").val());
            optionsModal.hide();
        })
    } else {
        optionsModal.show();
        $("#optionsText").removeClass("d-block").addClass("d-none");
        $("#optionsSelect").removeClass("d-none").addClass("d-block");
        $("#optionsSelect").html("");
        for (let i in optionsArray) {
            $("#optionsSelect").append(`<option value=${optionsArray[i]}>${optionsArray[i].split("-")[1]}</option>`)
        }

        $("#save").click(() => {
            let style = $("#optionsSelect").val().split("-")[0];
            let regex = new RegExp(`^${style}-.+`, "g");
            $(clickedElement[0])[0].className = $(clickedElement)[0].className.replace(regex, '');
            $(clickedElement[0]).addClass($("#optionsSelect").val())
            optionsModal.hide();
        })
    }
}

let showModalAttr = (text, attr) => {
    optionsModal.show();
    $("#optionsText").removeClass("d-none").addClass("d-block");
    $("#optionsSelect").removeClass("d-block").addClass("d-none");
    $("#optionsModalLabel").text(text);

    $("#save").click(() => {
        $(clickedElement[0]).attr(attr, $("#optionsText").val());
    })
}

let action = (action, parent) => {
    switch (action) {
        case "edittext":
            showModal(`Edit the element's ${parent.toLowerCase()}.`);
            break;
        case "moveup":
            if ($(clickedElement[0]).prop("tagName") != "LI") {
                $(clickedElement[0]).insertBefore($(clickedElement[0]).prev());
            } else {
                let ul = $(clickedElement[0]).parent();
                $(ul).insertBefore($(ul).prev());
            }
            break;
        case "movedown":
            if ($(clickedElement[0]).prop("tagName") != "LI") {
                $(clickedElement[0]).insertAfter($(clickedElement[0]).next());
            } else {
                let ul = $(clickedElement[0]).parent();
                $(ul).insertAfter($(ul).next());
            }
            break;
        case "delete":
            if ($(clickedElement[0]).prop("tagName") != "LI") {
                console.log(clickedElement[0])
                $(clickedElement[0]).remove();
            } else {
                let ul = $(clickedElement[0]).parent();
                $(ul).remove();
            }

            $("#propsCollapse").collapse("hide")
            $(".title").html(`Select an element to edit its properties.`);
            $(".customOption").remove();
            break;
        case "addsource":
            showModalAttr("Change the image source.", "src");
            break;
        case "addalternate":
            showModalAttr("Change the image alternate.", "alt");
            break;
        default:
            showModal(`Edit the element's ${parent.toLowerCase()}.`, options.all[parent].options);
            break;
    }
}