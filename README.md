#pixels-notation

Un outil de notation personnalisé pour la page pixels du monde.fr
http://loichuck.github.io/pixels-notation/

---

##Comment l'utiliser ?

###Structure

Par défaut seulement trois éléments sont obligatoires :

 - Les **critères**.
 - Les **éléments** à trier.
 - L'**initialisation** du plugin.

Ci-dessous la structure *html* pour obtenir la même **apparence** que dans **l'exemple** :

```html
<div class="pxl-notation">
    <h2 class="pxl-title">[...]</h2>
    <div class="pxl-description">[...]</div>
    <div class="pxl-notes">
	    [...]
    </div>
    <div class="pxl-products">
        [...]
    </div>
</div>
```

###Critères

Chaque critère de notation est défini directement dans le html grâce à un **attribut** `data-criteria` qui doit être en **minuscule, tout attaché**. ex :

```html
<div data-criteria="price"></div>
```

Des options facultatives supplémentaires sont disponible

- `data-step="3"` permet de définir le nombre de "crans" des jauges.
- `data-limit` (sans valeur) ce critère est considéré comme une limite. Ceci permet par exemple de ne pas afficher les éléments qui dépassent un certain prix. Cette option ajoute deux autres options.
	- `data-min` valeur minimum sélectionnable.
	- `data-max` valeur maximum sélectionnable.

---

Ci-dessous une **version** un peu plus **évolué** avec un titre et le *style pixels* à ajouter entre les balises `<div class="pxl-notes"></div>` de l'exemple précédent :

```html
<div class="pxl-criteria">
    <h3 class="pxl-bar-title">[...]</h3>
    <div class="pxl-bar" data-criteria="[...]"></div>
</div>
```

###Éléments

Pour chaque élément il faut définir sa note dans chaque critère (ceux défini dans l'étape précédente) en écrivant `data-criteria-[le nom du critère]`.
Pour l'exemple précédent (`data-criteria="price"`) il faudra donc écrire :

```html
<div data-criteria-price="25"></div>
```

Il faut ensuite ajouter l’ensemble des autres critères, pour tous les éléments, pour correctement définir leur notes.

```html
<div data-criteria-critere1="82" data-criteria-critere2="68" data-criteria-critere3="42"></div>
```

---

Et la version avec un titre, l'affichage de la note, une jauge circulaire et le *style pixels* à ajouter entre les balises `<div class="pxl-products"></div>` :

```html
<div class="pxl-product" data-criteria-price="25">
    <canvas width="120" height="120"></canvas>
    <h3 class="pxl-product-title">[...]</h3>
    <p class="pxl-product-note"></p>
</div>
```

###Initialisation

Pour initialiser le plugin ajouter le code **javascript** ci-dessous.

```javascript
Notation.init();
```

Les options suivantes sont disponibles et facultatives (ici les options par défaut)

```javascript
Notation.init({
	criteria: "[data-criteria]", // Selecteur des critères
	container: ".pxl-products",   // Selecteur du contenant
	products:  ".pxl-product",    // Selecteur des éléments
    notation: 100                // Barème de notation
});
```
