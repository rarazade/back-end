import * as repo from "../repositories/jumbotronRepository.js";

export const getAll = async () => {
  const jumbotrons = await repo.getAllJumbotrons();
  return jumbotrons.map(item => ({
    ...item,
    game: {
      ...item.game,
      imageUrl: `${process.env.BACKEND_ORIGIN}/uploads/${item.game.img}`,
      screenshots: item.game.screenshots.map(s => `${process.env.BACKEND_ORIGIN}/uploads/${s.image}`),
      videos: item.game.videos.map(v => `${process.env.BACKEND_ORIGIN}/uploads/${v.url}`)
    }
  }));
};

export const add = (gameId) => repo.addJumbotron(gameId);

export const deleteJumbotron = async (id) => {
  return await repo.deleteById(id);
};
