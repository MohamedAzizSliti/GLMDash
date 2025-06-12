import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {SettingMapModel} from "../models/setting-map.model";

@Injectable({
  providedIn: 'root'
})
export class MapSettingsService {
  private defaultSettings : SettingMapModel = new SettingMapModel();

  private settingsSubject = new BehaviorSubject<any>(this.loadSettings());
  settings$ = this.settingsSubject.asObservable();

  constructor() {}

  // Charger les paramètres depuis localStorage
  private loadSettings(): any {
    const savedSettings = localStorage.getItem('mapSettings');
    return savedSettings ? JSON.parse(savedSettings) : this.defaultSettings;
  }

  // Sauvegarder les paramètres dans localStorage
  private saveSettings(settings: any): void {
    localStorage.setItem('mapSettings', JSON.stringify(settings));
    this.settingsSubject.next(settings);
  }

  // Récupérer les paramètres actuels
  getSettings(): any {
    return this.settingsSubject.value;
  }

  // Mettre à jour un paramètre spécifique
  updateSetting(key: string, value: any): void {
    const newSettings = { ...this.getSettings(), [key]: value };
    this.saveSettings(newSettings);
  }

  // Appliquer tous les paramètres
  setAllSettings(settings: any): void {
    this.saveSettings(settings);
  }

  // Réinitialiser aux paramètres par défaut
  resetSettings(): void {
    this.saveSettings(this.defaultSettings);
  }
}
