/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */


import {Component, computed, ElementRef, ViewChild, ViewChildren} from '@angular/core';
// TODO: update imports to the exported authoring functions when those are public
import {viewChild, viewChildren} from '@angular/core/src/authoring/queries';
import {TestBed} from '@angular/core/testing';

describe('queries as signals', () => {
  describe('view', () => {
    it('should query for an optional element in a template', () => {
      @Component({
        standalone: true,
        template: `<div #el></div>`,
      })
      class AppComponent {
        // TODO: remove decorator when we've got a transform in place
        @ViewChild('el', {isSignal: true} as any)
        divEl = viewChild<ElementRef<HTMLDivElement>>('el');
        foundEl = computed(() => this.divEl() != null);
      }

      const fixture = TestBed.createComponent(AppComponent);
      // with signal based queries we _do_ have query results after the creation mode execution
      // (before the change detection runs) so we can return those early on! In this sense all
      // queries behave as "static" (?)
      expect(fixture.componentInstance.foundEl()).toBeTrue();

      fixture.detectChanges();
      expect(fixture.componentInstance.foundEl()).toBeTrue();

      // non-required query results are undefined before we run creation mode on the view queries
      const appCmpt = new AppComponent();
      expect(appCmpt.divEl()).toBeUndefined();
    });

    it('should query for a required element in a template', () => {
      @Component({
        standalone: true,
        template: `<div #el></div>`,
      })
      class AppComponent {
        // TODO: remove decorator when we've got a transform in place
        @ViewChild('el', {isSignal: true} as any)
        divEl = viewChild.required<ElementRef<HTMLDivElement>>('el');
        foundEl = computed(() => this.divEl() != null);
      }

      const fixture = TestBed.createComponent(AppComponent);
      // with signal based queries we _do_ have query results after the creation mode execution
      // (before the change detection runs) so we can return those early on! In this sense all
      // queries behave as "static" (?)
      expect(fixture.componentInstance.foundEl()).toBeTrue();

      fixture.detectChanges();
      expect(fixture.componentInstance.foundEl()).toBeTrue();

      // non-required query results are undefined before we run creation mode on the view queries
      const appCmpt = new AppComponent();
      expect(() => {
        appCmpt.divEl();
      }).toThrowError('NG00: no query results yet!');
    });

    it('should query for multiple elements in a template', () => {
      @Component({
        standalone: true,
        template: `
          <div #el></div>
        `,
      })
      class AppComponent {
        // TODO: remove decorator when we've got a transform in place
        @ViewChildren('el', {isSignal: true} as any)
        divEls = viewChildren<ElementRef<HTMLDivElement>>('el');
        foundEl = computed(() => this.divEls().length);
      }

      const fixture = TestBed.createComponent(AppComponent);
      // with signal based queries we _do_ have query results after the creation mode execution
      // (before the change detection runs) so we can return those early on! In this sense all
      // queries behave as "static" (?)
      expect(fixture.componentInstance.foundEl()).toBe(1);

      fixture.detectChanges(false);
      expect(fixture.componentInstance.foundEl()).toBe(1);

      // non-required query results are undefined before we run creation mode on the view queries
      const appCmpt = new AppComponent();
      expect(appCmpt.divEls().length).toBe(0);
    });
  });
});