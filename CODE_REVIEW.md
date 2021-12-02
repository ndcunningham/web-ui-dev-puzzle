## Book Search Component
# 
### Problems
1. Inside `ngOnInit` for `book-search-component.ts` there is a `.subscribe` call without a `unsubscribe` for that reference.

2. Although `book-search-component.spec.ts` exist there are no test cases reflecting the current behaviour of `book-search-component.ts`
The same applies to components in `total-count/` and `reading-list/`

3. The `formatDate` function can be replaced with the `date` pipe which is provided by Angular framework.

### Improvements
1. Searching for books with a specified keyword and initiating the search by pressing enter works. However, after erasing that keyword and entering a new key word the list will be prepopulated with the old results.

2. Using `async` pipe instead of a subscribe in `ngOnInit` . Similar to the component inside `reading-list/`.