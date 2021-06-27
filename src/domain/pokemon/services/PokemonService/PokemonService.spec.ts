import { Pokemon } from '../../entities';
import { PokemonRepository } from '../../repositories';
import {
  NumberInteger,
  PokemonName,
  PokemonType,
} from '../../valueObjects';
import PokemonService from './PokemonService';

class MemoryPokemonRepository implements PokemonRepository {
  private allPokemons: Pokemon[];
  constructor() {
    this.allPokemons = [];
  }
  getAll(): Promise<Pokemon[]> {
    return Promise.resolve(this.allPokemons.map(item => this.cloneIfDefined(item)));
  }
  findByPokemonId(pokemonId: NumberInteger): Promise<Pokemon> {
    return Promise.resolve(
      this.cloneIfDefined(
        this.allPokemons.find((pokemon) => pokemon.pokemonId.equals(pokemonId)),
      ),
    );
  }
  async save(pokemon: Pokemon): Promise<void> {
    const currentPokemon = await this.findByPokemonId(pokemon.pokemonId);
    if (currentPokemon) {
      this.allPokemons = this.allPokemons.map((itemPokemon) => {
        if (itemPokemon.equals(pokemon)) {
          return this.cloneIfDefined(pokemon);
        }
        return itemPokemon;
      });
    } else {
      this.allPokemons = [...this.allPokemons, this.cloneIfDefined(pokemon)];
    }
  }
  async remove(pokemon: Pokemon): Promise<void> {
    this.allPokemons = this.allPokemons.filter((pokemon) => !pokemon.pokemonId.equals(pokemon.pokemonId));
  }

  private cloneIfDefined(pokemon?: Pokemon) {
    if (!pokemon) {
      return undefined;
    }
    return Pokemon.create({
      pokemonId: pokemon.pokemonId,
      name: pokemon.name,
      type: pokemon.type,
    });
  }
}

describe('PokemonService', () => {
  describe('register', () => {
    const pokemon1 = Pokemon.create({
      pokemonId: NumberInteger.create(1),
      name: PokemonName.create('Pikachu'),
      type: PokemonType.create('Electric'),
    });
    const pokemon2 = Pokemon.create({
      pokemonId: NumberInteger.create(2),
      name: PokemonName.create('Bubassauro'),
      type: PokemonType.create('Grass'),
    });
    const pokemonRepository = new MemoryPokemonRepository();
    let pokemonService: PokemonService;

    beforeAll(async () => {
      await pokemonRepository.save(pokemon1);
      await pokemonRepository.save(pokemon2);
      pokemonService = new PokemonService(pokemonRepository);
    });

    it('should throw to invalid Pokemon ID', async () => {
      await expect(
        pokemonService.register({
          pokemonId: 0,
          name: 'Squirtle',
          type: 'Water',
        }),
      ).rejects.toThrow();
    });

    it('should throw to invalid pokemon name', async () => {
      await expect(
        pokemonService.register({
          pokemonId: 3,
          name: 'Squirtle2',
          type: 'Water',
        }),
      ).rejects.toThrow();
    });

    it('should throw to invalid pokemon Type', async () => {
      await expect(
        pokemonService.register({
          pokemonId: 3,
          name: 'Squirtle',
          type: 'Space',
        }),
      ).rejects.toThrow();
    });

    it('should throw to email already registered', async () => {
      await expect(
        pokemonService.register({
          pokemonId: pokemon1.pokemonId.value,
          name: 'Squirtle',
          type: 'Water',
        }),
      ).rejects.toThrow();
      await expect(
        pokemonService.register({
          pokemonId: pokemon2.pokemonId.value,
          name: 'Squirtle',
          type: 'Water',
        }),
      ).rejects.toThrow();
    });

    it('should create to a new valid pokemon', async () => {
      const newPokemonId = 3;
      await expect(
        pokemonService.register({
          pokemonId: newPokemonId,
          name: 'Squirtle',
          type: 'Water',
        }),
      ).resolves.toBeUndefined();
      await expect(
        pokemonRepository.findByPokemonId(NumberInteger.create(newPokemonId)),
      ).resolves.toBeDefined();
    });
  });
});
