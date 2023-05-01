
function updatePage(page) {
    switch(page) {
        case "page1":
            image= "recipe1.jpg";
            break;
        case "page2":
            document.getElementsByClassName("recipe-img").src = "recipe2.jpg";
            break;
        case "page3":
            document.getElementsByClassName("recipe-img").src = "recipe3.jpg";
            break;
        default:
            break;
    }
}
