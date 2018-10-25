(function ($) {

    function doSearch(project) {

        $.ajax({
            method: "POST",
            url: "https://scanr.enseignementsup-recherche.gouv.fr/api/project/search",
            headers: {
                "Accept" : "application/json;charset=UTF-8",
                "Content-type":"text/plain"
            },
            data: project
        })
            .done(function (serverResponse) {
                /* Cette fonction est exécutée lorsque le serveur nous envoie la réponse à notre requête. */
                console.log(serverResponse);

                if(serverResponse[0]){
                    // on récupère l'ID du projet pour faire une 2e requête de type GET
                    let projectId = serverResponse[0].id;
                    $.ajax({
                        method: "GET",
                        url: "https://scanr.enseignementsup-recherche.gouv.fr/api/project/"+projectId,
                        headers: {
                            "Accept" : "application/json;charset=UTF-8"
                        }
                    })
                    .done(function (project) {
                        // à l'issue de la 2e requête on peuple le tableau avec les éléments de la réponse
                        console.log(project);
                        $("#project-id").html("<a href='"+project.url+"' target='_blank'>"+project.id+"</a>");
                        $("#project-type").text(project.type);
                        $("#project-acronym").text(project.acronym);
                        $("#project-label").text(project.label);
                        $("#project-description").text(project.description);
                        $("#project-year").text(project.year);
                        $("#project-budget").text(project.budget + "€");
                        $("#project-duration").text(project.duration + " months");
                        $("#project-call").text(project.callLabel+" (" + project.call + ")" );
                        $("#project-structures").text(project.structures.map(struct => struct.label).join(", "));
                    })
                    .fail(function (error) {
                        console.error(error);
                    });
                }
            })
            .fail(function (error) {
                console.error(error);
            });
    }

    $("#search-form").submit(function (event) {
        event.preventDefault();
        /*
        On récupère le texte contenu dans le champ d'id "search-field"
        et on le stocke dans une variable "query"
         */
        let searchQuery = $('#search-field').val();
        console.log(searchQuery);
        $("#response-list").empty();

        doSearch(searchQuery);

        return false;
    });

})(window.jQuery);
