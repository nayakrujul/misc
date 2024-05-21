# [sort-table.js](https://github.com/nayakrujul/misc/blob/main/js/sort-table/main.js)

A small JS program to add sorting buttons to your table.

## Quick Start

Just add the script into your HTML file using:

```html
<script src="https://misc.rujulnayak.com/js/sort-table/main.js"></script>
```

Then, choose either one of the following methods:

### HTML

Just add the `sort-table` class.

```html
<table class="sort-table">
    ...
</table>
```

The program will automatically pick it up.

### JS

Alternatively, call the `makeSortable` function from your JS file.

```javascript
makeSortable(myTable);
```

Note: your JS `<script>` tag must be underneath the `sort-table` `<script>` tag.

## Other Functions

### Numeric sorting

The default sorting method is string comparison: if you need to sort a column based on numeric value,
add the `st-num` class to the column's header:

```html
<th class="st-num">...</th>
```

### Reset buttons

If you need to change all buttons in a table back to the starting image, use the following JS code:

```javascript
resetButtons(myTable);
```

## License

This is licensed under [GPLv3](https://github.com/nayakrujul/misc/blob/main/LICENSE),
so you can do pretty much whatever you want with it.