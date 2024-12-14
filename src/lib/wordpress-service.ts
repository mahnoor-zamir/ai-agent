import axios, { AxiosError } from 'axios';

export class WordPressService {
  async getPages() {
    try {
      const response = await axios.get('/api/wordpress-proxy?endpoint=pages');
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch pages');
    }
  }

  async getPage(pageId: number) {
    try {
      const response = await axios.get(`/api/wordpress-proxy?endpoint=pages/${pageId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch page');
    }
  }

  async updatePage(pageId: number, title: string, content: string) {
    try {
      const response = await axios.post(`/api/wordpress-proxy?endpoint=pages/${pageId}`, {
        title,
        content
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Failed to update page');
    }
  }

  private handleError(error: unknown, context: string): Error {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.error(`${context}:`, {
        message: axiosError.message,
        response: axiosError.response?.data,
        status: axiosError.response?.status,
      });
      return new Error(`${context}: ${axiosError.message}`);
    } else if (error instanceof Error) {
      console.error(`${context}:`, error.message);
      return error;
    } else {
      console.error(`${context}:`, error);
      return new Error(`${context}: An unknown error occurred`);
    }
  }
}

