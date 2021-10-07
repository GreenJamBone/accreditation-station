import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class RequirementsService {
  constructor(private http: HttpClient) {}
 
  // Uses http.get() to load data from a single API endpoint
  addRequirement(payload): Observable<any> {
      return this.http.post(environment.root_path + environment.createRequirement, payload);
  }

  getAllRequirements(): Observable<any> {
      return this.http.get(environment.root_path + environment.allRequirements);
  }

  updateRequirement(payload): Observable<any> {
      return this.http.post(environment.root_path + environment.updateRequirement, payload);
  } 

  removeRequirement(payload): Observable<any> {
      return this.http.post(environment.root_path + environment.removeRequirement, payload);
  }
}
