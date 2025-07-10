import StoryListPresenter from '../pages/app';
import AddStoryPresenter from '../pages/add_story/add-story-presenter';
import LoginPresenter from '../pages/auth/login-presenter';
import RegisterPresenter from '../pages/auth/register-presenter';
import DetailStoryPresenter from '../pages/detail_story/detail-story-presenter';
import SavedStoriesPage from '../pages/saved_stories/saved-stories-page';

const routes = {
  '/': StoryListPresenter,
  '/add': AddStoryPresenter,
  '/login': LoginPresenter,
  '/register': RegisterPresenter,
  '/stories/:id': DetailStoryPresenter,
  '/saved': SavedStoriesPage,
};

export default routes;