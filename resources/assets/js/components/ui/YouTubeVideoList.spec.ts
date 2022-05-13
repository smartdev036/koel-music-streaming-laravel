import { expect, it } from 'vitest'
import factory from '@/__tests__/factory'
import ComponentTestCase from '@/__tests__/ComponentTestCase'
import YouTubeVideoList from './YouTubeVideoList.vue'
import Btn from '@/components/ui/Btn.vue'
import YouTubeVideo from '@/components/ui/YouTubeVideoItem.vue'
import { youTubeService } from '@/services'
import { fireEvent } from '@testing-library/vue'

let song: Song

new class extends ComponentTestCase {
  private renderComponent () {
    song = factory<Song>('song', {
      youtube: {
        items: factory<YouTubeVideo>('video', 5),
        nextPageToken: 'f00'
      }
    })

    return this.render(YouTubeVideoList, {
      props: {
        song
      },
      global: {
        stubs: {
          Btn,
          YouTubeVideo
        }
      }
    })
  }

  protected test () {
    it('displays a list of videos', () => {
      expect(this.renderComponent().getAllByTestId('youtube-search-result').length).toBe(5)
    })

    it('loads more videos', async () => {
      const mock = this.mock(youTubeService, 'searchVideosRelatedToSong').mockResolvedValue({
        nextPageToken: 'b4r',
        items: factory<YouTubeVideo>('video', 5)
      })

      const { getAllByTestId, getByTestId } = this.renderComponent()

      await fireEvent.click(getByTestId('youtube-search-more-btn'))

      expect(mock).toHaveBeenCalledWith(song, 'f00')

      await this.tick()
      expect(getAllByTestId('youtube-search-result').length).toBe(10)
    })
  }
}