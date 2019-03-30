# flight-board
Affichage d'un tableau de départs des vols style aéroport

# command lines
Démarrer le projet
```
$ git clone https://github.com/aphilou/flight-board.git
$ ng new flight-board --style=scss --skip-tests=true
$ npm install bootstrap@3.3.7 --save
```
Construire l'arborescence à déployer
```
$ ng build --output-path docs --base-href flight-board-deployed
```
Puis copier index.html en 404.html