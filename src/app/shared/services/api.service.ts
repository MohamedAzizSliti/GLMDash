import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8000/admin/api/test'; // Fixed URL to match Laravel routes

  constructor(private http: HttpClient) {}

  // Admin Enrollment Management
  getAdminEnrollments(params?: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/enrollments`, { params });
  }

  getEnrollmentStatistics(params?: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/enrollments/statistics`, { params });
  }

  getRevenueSummary(params?: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/enrollments/revenue-summary`, { params });
  }

  updateEnrollmentStatus(id: number, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/enrollments/${id}/status`, { status });
  }

  // Admin Revenue Management
  getAdminRevenueSummary(params?: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/revenue/summary`, { params });
  }

  getCharityContributions(params?: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/revenue/charity-contributions`, { params });
  }

  getMonthlyRevenueBreakdown(params?: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/revenue/monthly-breakdown`, { params });
  }
} 