export default ({store, route, redirect}) => {
  if(route.name === 'search') {
    redirect('/fastResult/brandLike')
  }
  if (!route.matched.length) {
    redirect('/404')
  }
}
