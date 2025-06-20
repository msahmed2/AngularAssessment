import { Component } from '@angular/core';
import { NgModel } from '@angular/forms';

interface Page {
  name: string;
  id: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  pages: Page[] = [
    { name: 'Info', id: 1 },
    { name: 'Details', id: 2 },
    { name: 'Other', id: 3 },
    { name: 'Ending', id: 4 }
  ];
  activePage: Page = this.pages[0];
  hoveredIndex: number | null = null;
  contextMenuIndex: number | null = null;
  dragIndex: number | null = null;
  renamingIndex: number | null = null;

  selectPage(page: Page) {
    this.activePage = page;
  }

  onDragStart(event: DragEvent, index: number) {
    this.dragIndex = index;
    event.dataTransfer?.setData('text/plain', index.toString());
  }

  onDragOver(event: DragEvent, index: number) {
    event.preventDefault();
    this.hoveredIndex = index;
  }

  onDrop(event: DragEvent, index: number) {
    event.preventDefault();
    if (this.dragIndex !== null) {
      const draggedPage = this.pages.splice(this.dragIndex, 1)[0];
      this.pages.splice(index, 0, draggedPage);
      this.dragIndex = null;
      this.hoveredIndex = null;
    }
  }

  addPage(index: number) {
    const newPage = { name: `Page ${this.pages.length + 1}`, id: Date.now() };
    this.pages.splice(index, 0, newPage);
  }

  toggleContextMenu(index: number, event: MouseEvent) {
    event.preventDefault();
    this.contextMenuIndex = this.contextMenuIndex === index ? null : index;
  }

  closeContextMenu() {
    this.contextMenuIndex = null;
    this.renamingIndex = null;
  }

  startRename(index: number) {
    this.renamingIndex = index;
  }

  finishRename(index: number) {
    this.renamingIndex = null;
  }

  duplicatePage(index: number) {
    const pageToDuplicate = { ...this.pages[index], id: Date.now() };
    this.pages.splice(index + 1, 0, pageToDuplicate);
    this.closeContextMenu();
  }

  deletePage(index: number) {
    if (this.pages.length > 0) {
      this.pages.splice(index, 1);
      if (this.activePage.id === this.pages[index - 1]?.id) {
        this.activePage = this.pages[0];
      } else if (index > 0) {
        this.activePage = this.pages[index - 1];
      } else {
        this.activePage = this.pages[0];
      }
      this.closeContextMenu();
    }
  }

  setAsFirstPage(index: number) {
    if (index > 0) {
      const page = this.pages.splice(index, 1)[0];
      this.pages.unshift(page);
      this.activePage = page;
      this.closeContextMenu();
    }
  }
}
