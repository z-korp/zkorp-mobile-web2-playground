# Configuration Supabase pour zkorp-mobile-web2-playground

## 1. Création du projet Supabase

1. Allez sur [supabase.com](https://supabase.com) et créez un compte
2. Créez un nouveau projet
3. Choisissez un nom et un mot de passe pour votre base de données
4. Attendez que le projet soit initialisé (quelques minutes)

## 2. Configuration des variables d'environnement

1. Copiez le fichier `.env.example` vers `.env` :
   ```bash
   cp .env.example .env
   ```

2. Dans votre projet Supabase, allez dans **Settings > API**
3. Récupérez les valeurs suivantes et ajoutez-les dans votre fichier `.env` :

   ```env
   # Supabase Configuration
   EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## 3. Création des tables de base de données

Exécutez ces commandes SQL dans l'éditeur SQL de Supabase (**SQL Editor**) :

```sql
-- Création de la table notes
create table notes (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  content text not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Mise à jour automatique du timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language 'plpgsql';

create trigger update_notes_updated_at
  before update on notes
  for each row
  execute procedure update_updated_at_column();

-- Index pour améliorer les performances
create index notes_user_id_idx on notes(user_id);
create index notes_updated_at_idx on notes(updated_at desc);
```

## 4. Configuration Row Level Security (RLS)

Activez RLS et créez les politiques de sécurité :

```sql
-- Activer RLS sur la table notes
alter table notes enable row level security;

-- Politique : Les utilisateurs peuvent voir leurs propres notes
create policy "Users can view their own notes" on notes
  for select using (auth.uid() = user_id);

-- Politique : Les utilisateurs peuvent créer leurs propres notes
create policy "Users can create their own notes" on notes
  for insert with check (auth.uid() = user_id);

-- Politique : Les utilisateurs peuvent modifier leurs propres notes
create policy "Users can update their own notes" on notes
  for update using (auth.uid() = user_id);

-- Politique : Les utilisateurs peuvent supprimer leurs propres notes
create policy "Users can delete their own notes" on notes
  for delete using (auth.uid() = user_id);
```

## 5. Configuration de l'authentification

1. Dans **Authentication > Settings**, configurez :
   - **Site URL** : Ajoutez votre URL de développement si nécessaire
   - **Redirect URLs** : Ajoutez les URLs de redirection pour votre app

2. Pour l'authentification par email (optionnel) :
   - Configurez les templates d'email dans **Authentication > Email Templates**

3. Pour les réseaux sociaux (optionnel) :
   - Configurez les providers dans **Authentication > Providers**

## 6. Configuration pour EAS (Production)

Pour la production avec EAS, configurez les secrets :

```bash
# Ajout des secrets EAS
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "your-supabase-url"
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "your-anon-key"
```

## 7. Test de la configuration

1. Lancez l'application : `npm start`
2. Testez la création de compte
3. Testez la connexion
4. Testez la création/modification/suppression de notes

## 8. Surveillance et monitoring

Dans le dashboard Supabase, vous pouvez :
- Voir les utilisateurs inscrits dans **Authentication > Users**
- Consulter les données dans **Table Editor**
- Voir les logs dans **Logs**
- Monitorer les performances dans **Reports**

## 9. Backup et sécurité

- Configurez des backups automatiques dans **Settings > Database**
- Surveillez les tentatives de connexion suspectes
- Mettez régulièrement à jour vos clés API si nécessaire

## Dépannage

### Erreur de connexion
- Vérifiez que les URLs et clés sont correctes
- Vérifiez que RLS est bien configuré
- Consultez les logs Supabase

### Problèmes d'authentification
- Vérifiez les redirect URLs
- Vérifiez les paramètres email si vous utilisez l'auth par email

### Problèmes de performance
- Vérifiez les index sur vos tables
- Surveillez les queries lentes dans les logs