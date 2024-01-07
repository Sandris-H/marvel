class MarvelService {
  _apiBase = "https://gateway.marvel.com:443/v1/public/";
  _apiKey = "apikey=e2e2dc12ca67f3e96a3c7bcba4e56ea4";
  _charBaseOffset = 210;

  getResource = async (url) => {
    let res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, status: ${res.status}`);
    }
    return await res.json();
  };

  getAllCharacters = async (offset = this._charBaseOffset) => {
    const res = await this.getResource(
      `${this._apiBase}characters?limit=9&offset=${offset}&${this._apiKey}`
    );

    return res.data.results.map((char) => this._transformCharacter(char));
  };

  getCharacter = async (id) => {
    const res = await this.getResource(
      `${this._apiBase}characters/${id}?${this._apiKey}`
    );
    return this._transformCharacter(res.data.results[0]);
  };

  _transformCharacter = (char) => {
    return {
      id: char.id,
      name: char.name,
      description: char.description,
      thumbnail: char.thumbnail.path + "." + char.thumbnail.extension,
      homepage: char.urls[0].url,
      wiki: char.urls[1].url,
      comics: char.comics.items,
    };
  };
}

export default MarvelService;
