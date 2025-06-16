import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subject, forkJoin } from 'rxjs';
import { takeUntil, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { ChartComponent } from "ng-apexcharts";
import { ApiService } from '../../shared/services/api.service';

@Component({
  selector: 'app-dashboard_sales',
  templateUrl: './dashboard_sales.component.html',
  styleUrls: ['./dashboard_sales.component.scss']
})
export class Dashboard_salesComponent implements OnInit, OnDestroy {
  @ViewChild("chart") chart: ChartComponent;

  private destroy$ = new Subject<void>();

  // Loading states
  public isLoadingStats: boolean = false;
  public hasError: boolean = false;
  public errorMessage: string = '';

  // Real data properties
  public enrollmentStatistics: any = null;
  public revenueSummary: any = null;
  public monthlyRevenueData: any = null;

  // Dashboard metrics
  public totalEnrollments: number = 0;
  public activeEnrollments: number = 0;
  public totalRevenue: number = 0;
  public charityAmount: number = 0;

  // Demo data fallback
  public isDemoMode: boolean = true; // Start with demo mode

  // Chart configurations - Initialize with safe defaults
  public chartOptions: any = {
    series: [
      {
        name: "Revenue Total",
        data: [0],
        color: '#0da487',
      },
      {
        name: "Dons (3%)",
        data: [0],
        color: '#FFA53B',
      },
    ],
    chart: {
      height: 350,
      type: "line",
      zoom: { enabled: false }
    },
    dataLabels: { enabled: false },
    stroke: {
      curve: 'smooth',
      width: 4,
    },
    grid: {
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: false } }
    },
    legend: { show: true },
    xaxis: {
      categories: ['Jan']
    }
  };

  constructor(private apiService: ApiService) {
    this.initializeCharts();
    this.enableDemoMode(); // Initialize with demo data
  }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeCharts(): void {
    // Ensure chartOptions is always defined with safe defaults
    this.chartOptions = {
      series: [
        {
          name: "Revenue Total",
          data: [1200, 1800, 2400, 1900, 2800, 3200],
          color: '#0da487',
        },
        {
          name: "Dons (3%)",
          data: [36, 54, 72, 57, 84, 96],
          color: '#FFA53B',
        },
      ],
      chart: {
        height: 350,
        type: "line",
        zoom: { enabled: false }
      },
      dataLabels: { enabled: false },
      stroke: {
        curve: 'smooth',
        width: 4,
      },
      grid: {
        xaxis: { lines: { show: true } },
        yaxis: { lines: { show: false } }
      },
      legend: { show: true },
      xaxis: {
        categories: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun']
      }
    };
  }

  public loadDashboardData(): void {
    this.isLoadingStats = true;
    this.hasError = false;

    // Try to load real data, but always fall back to demo data
    forkJoin({
      enrollmentStats: this.apiService.getEnrollmentStatistics().pipe(
        catchError(error => {
          console.error('Error loading enrollment statistics:', error);
          return of(null);
        })
      ),
      revenueSummary: this.apiService.getRevenueSummary().pipe(
        catchError(error => {
          console.error('Error loading revenue summary:', error);
          return of(null);
        })
      ),
      monthlyRevenue: this.apiService.getMonthlyRevenueBreakdown().pipe(
        catchError(error => {
          console.error('Error loading monthly revenue:', error);
          return of(null);
        })
      )
    }).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (data) => {
        this.isLoadingStats = false;
        
        let hasRealData = false;

        if (data.enrollmentStats?.success) {
          this.enrollmentStatistics = data.enrollmentStats.data;
          this.updateEnrollmentMetrics();
          hasRealData = true;
        }

        if (data.revenueSummary?.success) {
          this.revenueSummary = data.revenueSummary.data;
          this.updateRevenueMetrics();
          hasRealData = true;
        }

        if (data.monthlyRevenue?.success) {
          this.monthlyRevenueData = data.monthlyRevenue.data;
          this.updateCharts();
          hasRealData = true;
        }

        if (hasRealData) {
          this.isDemoMode = false;
        } else {
          // Keep demo mode if no real data was loaded
          this.isDemoMode = true;
          this.errorMessage = 'API non disponible. Affichage des données de démonstration.';
        }
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        this.isLoadingStats = false;
        this.hasError = true;
        this.errorMessage = 'Erreur lors du chargement des données. Utilisation des données de démonstration.';
        this.isDemoMode = true;
      }
    });
  }

  private updateEnrollmentMetrics(): void {
    if (this.enrollmentStatistics?.summary) {
      this.totalEnrollments = this.enrollmentStatistics.summary.total_enrollments || 0;
      this.activeEnrollments = this.enrollmentStatistics.summary.active_enrollments || 0;
    }
  }

  private updateRevenueMetrics(): void {
    if (this.revenueSummary?.summary) {
      this.totalRevenue = this.revenueSummary.summary.total_revenue || 0;
      this.charityAmount = this.revenueSummary.summary.charity_amount || 0;
    }
  }

  private updateCharts(): void {
    if (!this.monthlyRevenueData?.monthly_data) return;

    const months = this.monthlyRevenueData.monthly_data.map(item => item.month || 'N/A');
    const revenues = this.monthlyRevenueData.monthly_data.map(item => item.total_revenue || 0);
    const charityAmounts = this.monthlyRevenueData.monthly_data.map(item => item.charity_amount || 0);

    // Ensure chartOptions exists before updating
    if (!this.chartOptions) {
      this.initializeCharts();
    }

    this.chartOptions = {
      ...this.chartOptions,
      series: [
        {
          name: "Revenue Total",
          data: revenues,
          color: '#0da487',
        },
        {
          name: "Dons (3%)",
          data: charityAmounts,
          color: '#FFA53B',
        },
      ],
      xaxis: {
        categories: months
      }
    };
  }

  private enableDemoMode(): void {
    this.isDemoMode = true;
    
    // Set demo data
    this.totalEnrollments = 1250;
    this.activeEnrollments = 980;
    this.totalRevenue = 45600;
    this.charityAmount = 1368; // 3% of total revenue

    // Ensure chart is initialized with demo data
    this.initializeCharts();
  }

  public refreshData(): void {
    this.loadDashboardData();
  }

  public formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount || 0);
  }

  public formatNumber(num: number): string {
    return new Intl.NumberFormat('fr-FR').format(num || 0);
  }

  public getCharityPercentage(): number {
    return 3; // Fixed 3% for charity
  }
} 