import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
 
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
 
@Injectable()
export class CourseService {
 
    constructor(private http: HttpClient) {}
 
    // Uses http.get() to load data from a single API endpoint
    addCourse(payload): Observable<any> {
        return this.http.post(environment.createCourse, payload);
    }

    getAllCourses(): Observable<any> {
        return this.http.get(environment.allCourses);
    }

    updateCourse(payload): Observable<any> {
        return this.http.post(environment.updateCourse, payload);
    } 

    removeCourse(payload): Observable<any> {
        return this.http.post(environment.removeCourse, payload);
    }

    getCoursesByUser(user_id): Observable<any> {
        return this.http.get(environment.coursesByUser + '/' + user_id);
    }
}