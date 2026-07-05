import { Component , model, input, signal} from '@angular/core';

@Component({
  selector: 'app-mychild',
  imports: [],
  templateUrl: './mychild.html',
  styleUrl: './mychild.scss',
})
export class Mychild {
  c_v = model<number>(0);
}
