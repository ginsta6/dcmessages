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

// Function to fetch congratulatory GIFs from Giphy
export default async function fetchCongratsGifs(): Promise<GiphyResponse | null> {
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
          q: 'congratulations',
          limit: 25,
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
