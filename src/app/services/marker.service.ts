import { Injectable } from '@angular/core';
import { Marker } from '../models/Marker.interface';
import {
  BehaviorSubject,
  Observable,
  catchError,
  map,
  tap,
  throwError,
} from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MarkerService {
  private apiUrl = '/api/markers/';
  private markersSubject = new BehaviorSubject<Marker[]>([]);
  markers$ = this.markersSubject.asObservable();

  constructor(private http: HttpClient) {}

  addMarker(marker: Marker): Observable<Marker> {
    return this.http.post<Marker>(this.apiUrl, marker).pipe(
      tap((response) => {
        const currentMarkers = this.markersSubject.value;
        this.markersSubject.next([...currentMarkers, response]);
      }),
      catchError((error) => {
        console.error('Error adding marker:', error);
        throw error;
      })
    );
  }

  getMarkers() {
    return this.markersSubject.value;
  }

  getAllMarkers(): Observable<Marker[]> {
    return this.http.get<Marker[]>(this.apiUrl).pipe(
      tap((response) => {
        this.markersSubject.next(response);
      }),
      catchError((error) => {
        console.log('Error getting markers:', error);
        throw error;
      })
    );
  }

  updateMarker(marker: Marker): Observable<Marker> {
    console.log(marker);
    return this.http.put<Marker>(`${this.apiUrl}${marker.id}`, marker).pipe(
      tap((response) => {
        const updatedMarkers = this.markersSubject.value.map((m) =>
          m.id === response.id ? response : m
        );
        this.markersSubject.next(updatedMarkers);
      }),
      catchError((error) => {
        console.log(`Error changing marker info with id ${marker.id}:`, error);
        throw error;
      })
    );
  }

  deleteMarker(marker: Marker) {
    return this.http.delete<Marker>(this.apiUrl + marker.id).pipe(
      tap(() => {
        const currentMarkers = this.markersSubject.value;
        const updatedMarkers = currentMarkers.filter((m) => m !== marker);
        this.markersSubject.next(updatedMarkers);
      }),
      catchError((error) => {
        console.log(`Error deleteing marker with id ${marker.id}:`, error);
        throw error;
      })
    );
  }
}
