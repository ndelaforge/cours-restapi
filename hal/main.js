(function ($) {

    function doSearch(authName) {

        /*
            On effectue la requête GET grâce à jQuery sur l'URL
            "https://api.archives-ouvertes.fr/search/?wt=json&q=authFullName_s:"NOM DE L'AUTEUR"&fl=label_s,title_s,abstract_s,authFullName_s"
         */
        $.ajax(
            {
                method: "GET",
                url: "https://api.archives-ouvertes.fr/search/" +
                    "?wt=json" +
                    "&q=authFullName_s:" + "\"" + authName + "\"" +
                    "&fl=uri_s,label_s,title_s,abstract_s,authFullName_s,producedDate_tdate" +
                    "&sort=producedDate_tdate desc" +
                    "&start=0&rows=50"
            }
        )
            .done(function (serverResponse) {

                    /* Cette fonction est exécutée lorsque le serveur nous envoie la réponse à notre requête.
                       On parse la réponse pour récupérer les documents contenus dans un tableau. */

                    let docs = serverResponse.response.docs;
                    console.log(docs);

                    /*
                       On itère sur les éléments du tableau pour construire dynamiquement une ligne de tableau qu'on insère
                       ensuite dans la balise d'id "response-list" grâce à la méthode append de jQuery. */

                    docs.forEach(function (doc) {
                        let options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
                        let publicationDate = new Date(doc.producedDate_tdate[0]).toLocaleDateString('fr-FR', options);
                        // dans le cas où l'abstract n'est pas définit on le remplace par "N.A" (not available)
                        let abstract = (doc.abstract_s) ? doc.abstract_s[0] : "N.A";
                        let tr = "<tr>" +
                            "<td>" + publicationDate + "</td>" +
                            "<td><a href='" + doc.uri_s + "' target='_blank'>" + doc.title_s[0] + "</td>" +
                            "<td>" + abstract + "</td>" +
                            "<td>" + doc.authFullName_s.join('<br/>') + "</td>" +
                            "</tr>";
                        $("#response-list").append(tr);
                    });
                }
            )
            .fail(function (xhr, textStatus, errorThrown) {
                alert("La requête a échoué. Impossible de charger les données.\n" +
                    "Code d'erreur: " + textStatus + "\n" +
                    "Message d'erreur: " + errorThrown);
            });
    }

    /*
    On "écoute" l'évènement "submit" sur le formulaire "search-form".
    Cet évènement sera levé à chaque fois qu'on appuiera sur le bouton "search" ou qu'on
    appuiera sur "entrée" dans le champ texte de la recherche.
     */
    $("#search-form").submit(function (event) {
        event.preventDefault(); // empêche le rechargement automatique de la page.
        /*
        On récupère le texte contenu dans le champ texte et on le stocke dans une variable "query"
         */
        let searchQuery = $('#search-field').val();
        console.log(searchQuery);
        $("#response-list").empty(); // on vide la liste réponse des éventuelles recherches précédentes
        doSearch(searchQuery); // on lance la recherche
    });

})(window.jQuery);
