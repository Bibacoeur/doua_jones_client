$(document).on("pagebeforeshow", "#tchat_perso", function() {
	//On efface la conversation
	$('#div_champs_messagerie').empty();
});
	var idJoueur = 1;
	var pseudo= 'Quentin';
	var hasscrolledmessagerie;
	
	
$(document).on("pageshow", "#tchat_perso", function() {
	//On initialise la page en disant qu'il n'y a pas eu de scroll
	hasscrolledmessagerie = false;
	var socket = io.connect('http://134.214.47.242:8080');
	socket.emit('getPrivateMessagesDestinataire', $('#tchat_perso').data("idDestinataire") ,idJoueur);
});

$(document).on("pageinit", "#tchat_perso", function() {
	var socket = io.connect('http://134.214.47.242:8080');
	hasscrolledmessagerie = false;
	$('#send_message_prive_form').submit(function(event) {
		event.preventDefault();
		event.stopImmediatePropagation();
		var mess = $('#message_prive_input').val();
		//Le message est envoyé s'il n'est pas vide
		if (mess != '') {
			socket.emit('setNewPrivateMessages', mess, $('#tchat_perso').data("idDestinataire"), idJoueur);
			socket.emit('privateMessage', $('#tchat_perso').data("pseudoDestinataire"), mess);
			// On écrit le message côté client
			$('#div_champs_messagerie').append("<div class='line_droite'><img src='img/bulle_droite.png' alt='' class='fleche_bulle_droite'/><div class='pseudo'> <b>" + "<font color="+pseudo_color +">" + pseudo + "</font>" + "</b> </div> " + "<div class='message'>" + mess + "</div> </div>");
			//Le champs texte est remis à zéro
			$('#message_prive_input').val('');
			//On scroll vers le bas
			$(document).scrollTop($(document).height());  
		}
		return false;
	});
	
	
	socket.on('updateChatPrive', function (username, data) {
		if (username == $('#tchat_perso').data("pseudoDestinataire") ) {
			var scrolleddown = true;
			if ($(window).scrollTop() + $(window).height() != $(document).height() && hasscrolledmessagerie==true) {
				scrolleddown = false;
			}
			$('#div_champs_messagerie').append("<div class='line_gauche'><img src='img/bulle_gauche.png' alt='' class='fleche_bulle_gauche'/><div class='pseudo'> <b>" + "<font color="+pseudo_color +">" + $('#tchat_perso').data("pseudoDestinataire") + "</font>" + "</b> </div> " + "<div class='message'>" + data + "</div> </div>");
		
			if (scrolleddown) {
			$(document).scrollTop($(document).height());  
			}
		}
	});
		
		
	socket.on('resultGetPrivateMessagesDestinataire', function(rows) {
		for (var i=0;i<rows.length;i++) {
			if (rows[i].JoueurEmetteur_idJoueur == $('#tchat_perso').data("idDestinataire")) {
				content = "<div class='line_gauche'><img src='img/bulle_gauche.png' alt='' class='fleche_bulle_gauche'/><div class='pseudo'> <b>" + "<font color="+pseudo_color +">" + $('#tchat_perso').data("pseudoDestinataire") + "</font>" + "</b> </div> " + "<div class='message'>" + rows[i].contenu + "</div> </div>"
			}
			else {
				content = "<div class='line_droite'><img src='img/bulle_droite.png' alt='' class='fleche_bulle_droite'/><div class='pseudo'> <b>" + "<font color="+pseudo_color +">" + pseudo + "</font>" + "</b> </div> " + "<div class='message'>" + rows[i].contenu + "</div> </div>"
			}
			$('#div_champs_messagerie').append(content);
		}
		$(document).scrollTop($(document).height());  
	});
	
	window.onscroll = function (e) {  
		hasscrolledmessagerie = true;  
	} 
	
});