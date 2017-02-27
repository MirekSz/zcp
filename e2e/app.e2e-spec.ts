import { ZcpPage } from './app.po';

describe('zcp App', function() {
  let page: ZcpPage;

  beforeEach(() => {
    page = new ZcpPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
