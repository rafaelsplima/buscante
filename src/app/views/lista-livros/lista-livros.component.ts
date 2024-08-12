import { catchError, debounceTime, distinctUntilChanged, EMPTY, filter, map, of, Subscription, switchMap, tap, throwError } from 'rxjs';
import { LivroService } from './../../service/livro.service';
import { Component, OnDestroy } from '@angular/core';
import { Item, Livro, LivrosResultado } from 'src/app/models/interfaces';
import { LivroVolumeInfo } from 'src/app/models/LivroVolumeInfo';
import { FormControl } from '@angular/forms';

const PAUSA = 300;

@Component({
  selector: 'app-lista-livros',
  templateUrl: './lista-livros.component.html',
  styleUrls: ['./lista-livros.component.css']
})
export class ListaLivrosComponent {

  campoBusca = new FormControl();
  mensagemErro='';
  livrosResultado: LivrosResultado;

  constructor(private service: LivroService) { }

  livrosEncontrados$ = this.campoBusca.valueChanges
    .pipe(
      debounceTime(PAUSA),
      filter((valorDigitado) => valorDigitado.length >=3),
      distinctUntilChanged(),
      switchMap((valorDigitado) => this.service.buscar(valorDigitado)),
      tap((retornoAPI) => console.log(retornoAPI)),
      map((resultadoApi) => this.livrosResultado = resultadoApi),
      map((resultadoApi) => resultadoApi.items?? []),
      map((itens) => this.listaItemLivros(itens)),
      catchError( () => {
        this.mensagemErro ='Ops, ocorreu um erro, Recarregue a aplicação!'
        return EMPTY;
      })
    );

  listaItemLivros(items: Item[]): LivroVolumeInfo[] {
    return items.map(item => {
      return new LivroVolumeInfo(item);
    })
  }

  /*
  buscarLivros() {
    this.subscription = this.service.buscar(this.campoBusca).subscribe({
      next: (items) => {
        console.log('Requisições feitas ao servidor');
        this.listaLivros = this.listaItemLivros(items);
      },
      error: error => console.error(error),
      complete: () => console.log('Observable completado')
    })
  }
  */

}



