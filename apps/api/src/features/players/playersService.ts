import { PlayerRepository } from "../../repositories/playerRepository"
import { HTTPException } from "hono/http-exception";

export const playersService = (deps: {
    playerRepository: PlayerRepository;
}) => {
    const retrievePlayer = async (props: {
        id: string;
    }) => {
        const player = await deps.playerRepository.findOneById({
            id: props.id,
        })

        if (!player) {
            throw new HTTPException(404, {
                message: 'Player not found',
            });
        }

        return player;
    };

    const createPlayer = async (props: {
        address: string;
    }) => {
        const createdPlayer = await deps.playerRepository.create({
            address: props.address,
        });

        return createdPlayer;
    };

    return {
        retrievePlayer,
        createPlayer,
    };
};

export type PlayersService = ReturnType<typeof playersService>;