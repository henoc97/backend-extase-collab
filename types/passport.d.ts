import 'passport';

declare global {
    namespace Express {
        interface User {
            _id: string; // Ajoutez toutes les propriétés spécifiques nécessaires ici
        }
    }
}
