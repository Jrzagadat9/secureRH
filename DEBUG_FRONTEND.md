# Debug Frontend - Erreur 400 lors de l'inscription

## 🔍 Diagnostic

Pour déboguer l'erreur 400, ouvrez la console du navigateur (F12) et vérifiez :

1. **Onglet Console** : Regardez les logs `console.error` que j'ai ajoutés
2. **Onglet Network** : 
   - Cliquez sur la requête `register/`
   - Regardez l'onglet "Response" pour voir l'erreur exacte du serveur

## 🛠️ Corrections Apportées

1. ✅ **Gestion des erreurs améliorée** dans `authStore.js`
   - Affichage détaillé des erreurs de validation Django
   - Logs dans la console pour le débogage

2. ✅ **Vue Register améliorée** dans `views.py`
   - Retourne les erreurs de validation de manière explicite

3. ✅ **Affichage des erreurs amélioré** dans `Register.jsx`
   - Message d'erreur plus visible

## 🧪 Test Manuel

1. Ouvrez la console du navigateur (F12)
2. Allez sur la page d'inscription
3. Remplissez le formulaire
4. Cliquez sur "S'inscrire"
5. Regardez la console et l'onglet Network pour voir l'erreur exacte

## 📝 Erreurs Possibles

### Erreur de validation du mot de passe
Si le mot de passe ne respecte pas les critères Django :
- Minimum 8 caractères
- Pas trop commun
- Pas entièrement numérique

### Erreur d'email déjà utilisé
Si l'email existe déjà dans la base de données

### Erreur de format
Si les données envoyées ne correspondent pas au format attendu

---

*Vérifiez la console du navigateur pour voir l'erreur exacte !*

