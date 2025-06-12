import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'speedFormat'
})
export class SpeedFormatPipe implements PipeTransform {
    transform(speed: number, unit: string = 'kmh'): string {
        if (!speed) return '0 km/h';

        let convertedSpeed: number;
        let unitLabel: string;

        switch (unit.toLowerCase()) {
            case 'mph':
                convertedSpeed = speed * 2.23694; // Conversion m/s → mph
                unitLabel = 'mph';
                break;
            case 'kmh':
            default:
                convertedSpeed = speed * 3.6; // Conversion m/s → km/h
                unitLabel = 'km/h';
                break;
        }

        return `${convertedSpeed.toFixed(1)} ${unitLabel}`;
    }
}
