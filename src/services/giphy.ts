import axios from 'axios';

export interface GiphyGifData {
  id: string;
  url: string;
  embed_url: string;
  title: string;
  images: {
    original: {
      url: string;
    };
  };
}

export interface GiphyResponse {
  data: GiphyGifData[];
  meta: {
    status: number;
    msg: string;
    response_id: string;
  };
  pagination: {
    total_count: number;
    count: number;
    offset: number;
  };
}

const { GIPHY_KEY } = process.env;


export default async function getRandomGif(query:string): Promise<GiphyGifData | null> {
  const results = await fetchCongratsGifs(query)
  if (!results) return null

  const randomInt = Math.floor(Math.random() * (49 - 0 + 1)) + 0;

  return results.data[randomInt]
}

// Function to fetch congratulatory GIFs from Giphy
async function fetchCongratsGifs(query: string): Promise<GiphyResponse | null> {
  if (!GIPHY_KEY) {
    console.error('GIPHY_KEY is not set in environment variables.');
    return null;
  }

  try {
    const response = await axios.get<GiphyResponse>(
      `https://api.giphy.com/v1/gifs/search`,
      {
        params: {
          api_key: GIPHY_KEY,
          q: query,
          limit: 50,
          offset: 0,
          rating: 'g',
          lang: 'en',
          bundle: 'messaging_non_clips',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Failed to fetch gif:', error);
    return null;
  }
}
