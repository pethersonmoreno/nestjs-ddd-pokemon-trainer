import Role from './Role';

describe('Role', () => {
    it('should not create Role directly', () => {
        expect(() => {
            new (Role as any)()
        }).toThrow();
        expect(() => {
            new (Role as any)('Administrator')
        }).toThrow();
    });

    it('should not create Role Administrator with create static method', () => {
        expect(() => {
            (Role as any).create('Administrator')
        }).toThrow();
    });

    it('should not create Role Pokemon Trainer with create static method', () => {
        expect(() => {
            (Role as any).create('PokemonTrainer')
        }).toThrow();
    });

    it('should create Role Administrator with createAdministrator static method', () => {
        expect(() => {
            Role.createAdministrator()
        }).not.toThrow();
    });

    it('should create Role Pokemon Trainer with createPokemonTrainer static method', () => {
        expect(() => {
            Role.createPokemonTrainer()
        }).not.toThrow();
    });

    it('createAdministrator should create with value Administrator', () => {
        expect((Role.createAdministrator() as any).value).toBe('Administrator');
    });

    it('createPokemonTrainer should create with value PokemonTrainer', () => {
        expect((Role.createPokemonTrainer() as any).value).toBe('PokemonTrainer');
    });

    it('should not change a value of Role object', () => {
        const role = Role.createAdministrator();
        expect(()=>{
            (role as any).value = 'PokemonTrainer'
        }).toThrow();
    });
});
