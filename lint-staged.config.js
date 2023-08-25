module.exports = {
  '{pages,utils}/**/!(*.min).js': ['prettier --write', 'eslint'],
  './*.js': ['prettier --write', 'eslint'],
}
