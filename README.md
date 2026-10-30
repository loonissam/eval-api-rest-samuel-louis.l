# Entre nous

Mini réseau social en **JavaScript** : un client React (Vite) et une API REST Node.js / Express avec une base MySQL gérée par Sequelize.

## Prérequis

- Node.js 22.12+ ou 24+ et npm
- MySQL (par exemple via XAMPP, WAMP ou un service MySQL installé)

## Installation

```sh
npm install
```

## Base de données MySQL

1. Démarrer MySQL.
2. Créer une base vide nommée `entre_nous` (avec phpMyAdmin, ou en ligne de commande) :

```sql
CREATE DATABASE entre_nous CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

3. Les tables `users`, `posts` et `comments` n'ont pas besoin d'être créées à la main : elles sont créées automatiquement au premier démarrage du serveur (`sequelize.sync()`). Les données restent en base après un redémarrage.

## Configuration

Copier le fichier d'exemple, puis renseigner ses propres valeurs :

```sh
cp .env.example .env
```

(sous Windows PowerShell : `Copy-Item .env.example .env`)

| Variable | Rôle | Exemple |
| --- | --- | --- |
| `PORT` | Port du serveur API | `3001` |
| `DB_HOST` | Hôte MySQL | `localhost` |
| `DB_PORT` | Port MySQL | `3306` |
| `DB_NAME` | Nom de la base | `entre_nous` |
| `DB_USER` | Utilisateur MySQL | `root` |
| `DB_PASSWORD` | Mot de passe MySQL | *(le vôtre)* |
| `JWT_KEY` | Clé secrète pour signer les jetons | *(une longue chaîne aléatoire)* |

Le fichier `.env` n'est pas versionné : ne jamais y mettre de secret dans le dépôt Git.

## Lancer en développement

Deux terminaux, ouverts dans le dossier du projet.

Terminal 1, serveur API (http://localhost:3001) :

```sh
npm run server
```

Le message `Connexion MySQL OK` doit s'afficher, suivi de `Serveur sur http://localhost:3001`.

Terminal 2, client React :

```sh
npm run dev
```

Ouvrir ensuite l'adresse affichée par Vite (par défaut http://localhost:5173). Le client redirige automatiquement les requêtes `/api` vers le serveur.

## Authentification

L'inscription et la connexion renvoient un jeton, à envoyer sur les routes protégées :

```
Authorization: Bearer <token>
```

Le jeton est invalidé à la déconnexion. Les jetons déjà déconnectés sont gardés en mémoire : ils sont oubliés au redémarrage du serveur.

## Routes de l'API

| Méthode | Route | Accès | Succès | Description |
| --- | --- | --- | --- | --- |
| POST | `/api/auth/register` | Public | 201 | Inscription (`username`, `password`) |
| POST | `/api/auth/login` | Public | 200 | Connexion (`username`, `password`) |
| GET | `/api/auth/me` | Protégé | 200 | Utilisateur connecté |
| POST | `/api/auth/logout` | Protégé | 204 | Déconnexion |
| GET | `/api/posts` | Public | 200 | Fil des publications avec auteurs et commentaires |
| POST | `/api/posts` | Protégé | 201 | Publier (`content`, 1 à 2000 caractères) |
| POST | `/api/posts/:postId/comments` | Protégé | 201 | Commenter (`content`, 1 à 500 caractères) |

Les erreurs renvoient toujours un JSON de la forme `{ "error": "message" }` avec les codes 400, 401, 404, 409 ou 500.

## Lancer l'API sans surveillance des fichiers

```sh
npm start
```

