<html>
	<head>
		<title>Barre de progression</title>
		<style type="text/css">
			body{
				margin-left: auto;
				margin-right: auto;
				text-align:center;
			}
			
			.cadre{
				margin-top: 250px;
				margin-left: auto;
				margin-right: auto;
				text-align:center;
				height: 50px;
				width: 900px;
				border: 1px solid black;
			}
			
			#barre{
				height: 50px;
				width: 0px;
				background-color: red;
			}
			
			.texte{
				text-align: center;
				font-size: 26px;
				font-weight: bold;
			}
		</style>
		<script type="text/javascript">
			var i=0;
			function progression(timer){
				if(i<=parseInt(document.getElementById('cadre').clientWidth)){
					var compteur=0;
					document.getElementById("barre").style.width=i+"px";
					while(compteur<=100)
						compteur++;
					if(i>40)
						document.getElementById("pourcentage").innerHTML=parseInt(i/(parseInt(document.getElementById('cadre').clientWidth)/100))+"%";
					setTimeout("progression();", timer);
					i++;   
				}
				else
					alert("Chargement Termine! Vous pourriez ensuite envisager d'utiliser une iframe pour afficher votre site ...");
			}
		</script>
	</head>
	<body onload="progression()">
		<noscript class="cadre">Vous devez activer le Javascript pour pouvoir visiter ce site !</noscript>
		<div class="cadre" id="cadre">
			<div id="barre">
				<span class="texte" id="pourcentage"></span>
			</div>
			<br /><br />
			<div class="texte">Chargement en cours ...</div>
		</div>
	</body>
</html>