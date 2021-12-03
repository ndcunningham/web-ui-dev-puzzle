import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { merge, of } from 'rxjs';
import { catchError, concatMap, exhaustMap, map, mapTo, take } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReadingListItem } from '@tmo/shared/models';
import * as ReadingListActions from './reading-list.actions';


@Injectable()
export class ReadingListEffects implements OnInitEffects {
  loadReadingList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.init),
      exhaustMap(() =>
        this.http.get<ReadingListItem[]>('/api/reading-list').pipe(
          map((data) =>
            ReadingListActions.loadReadingListSuccess({ list: data })
          ),
          catchError((error) =>
            of(ReadingListActions.loadReadingListError({ error }))
          )
        )
      )
    )
  );

  addBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.addToReadingList),
      concatMap(({ book }) => {
        const snackBarRef = this.snackBar.open(`${book.title} will be added to your list`, 'Undo');
        return merge(snackBarRef.afterDismissed().pipe(mapTo(true)), snackBarRef.onAction().pipe(mapTo(false))).pipe(
          take(1),
          concatMap((shouldAdd) => {
            if (shouldAdd) {
              return this.http.post('/api/reading-list', book).pipe(
                map(() => ReadingListActions.confirmedAddToReadingList({ book })),
                catchError(() =>
                  of(ReadingListActions.failedAddToReadingList({ book }))
                )
              )
            } else {
              return of(ReadingListActions.undoAddToReadingList())
            }
          })
        )
      })
    )
  );

  removeBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReadingListActions.removeFromReadingList),
      concatMap(({ item }) => {
        const snackBarRef = this.snackBar.open(`${item.title} will be removed from your list`, 'Undo');
        return merge(snackBarRef.onAction().pipe(mapTo(false)), snackBarRef.afterDismissed().pipe(mapTo(true))).pipe(
          take(1),
          concatMap((shouldRemove) => {
            if (shouldRemove) {
              return this.http.delete(`/api/reading-list/${item.bookId}`).pipe(
                map(() => ReadingListActions.confirmedRemoveFromReadingList({ item })),
                catchError(() => of(ReadingListActions.failedRemoveFromReadingList({ item }))))
            } else {
              return of(ReadingListActions.undoRemoveFromReadingList());
            }
          })
        )
      })
    ))


  ngrxOnInitEffects() {
    return ReadingListActions.init();
  }

  constructor(private actions$: Actions, private http: HttpClient, private snackBar: MatSnackBar) { }
}
