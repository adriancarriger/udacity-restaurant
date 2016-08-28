import { UdacityRestaurantPage } from './app.po';

describe('udacity-restaurant App', function() {
  let page: UdacityRestaurantPage;

  beforeEach(() => {
    page = new UdacityRestaurantPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
