<script>
  export default {
    name: 'list',

    props: {
      items: {
        required: true
      }
    },

    data() {
      return {
        expanded: []
      };
    },

    methods: {

      _renderList (h, items, _options) {
        const list = [];
        for (const item of items) {
          // options
          const options = {
            attrs: {
              'tabindex': 0
            }
          };

          // define li element items
          const liItems = [
            h('span', item.title)
          ];

          // define variables
          let method;

          if (item.items) {
            method = this.toggleExpand.bind(this, item)

            const expanded = this.expanded.includes(item);
            liItems.push(
              this._renderList(h, item.items, {
                class: {
                  expanded
                }
              })
            );

            liItems.unshift(
              h('i', {
                class: 'icon-' + (expanded ? 'down-open' : 'right-open')
              })
            );
          } else {
            method = this.clickItem.bind(this, item);
          }

          options.on = {
            click: method,
            keypress: method
          };

          list.push(
            h('li', options, liItems)
          );
        }

        return h('ul', _options, list);
      },

      toggleExpand (item, event) {
        event.stopPropagation();
        event.preventDefault();

        const idx = this.expanded.indexOf(item);
        if (idx >= 0) {
          // expanded already
          this.expanded.splice(idx, 1);
        } else {
          // hidden
          this.expanded.push(item);
        }
      },

      clickItem (item, event) {
        event.stopPropagation();
        event.preventDefault();
        this.$emit('click', item);
      }

    },

    render (h) {
      return this._renderList(h, this.items, {
        class: 'list'
      });
    }
  };
</script>

<style lang="less">
@import '~Stylesheets/colors';

ul.list {
  list-style: none;
  margin: 0;
  padding: 0;
  border: 1px solid @dandelion-milk;
  border-radius: 4px;

  li {
    list-style: none;
    margin: 0;
    padding: 0.9rem;
    line-height: 1;
    display: block;
    cursor: pointer;
    transition: background-color 0.25s;

    & > i {
      margin-right: 0.45rem;
    }

    &:not(:first-child) {
      border-top: 1px solid @dandelion-milk;
    }
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    margin-left: -0.9rem;
    margin-right: -0.9rem;
    border-left: 44px solid @dandelion-milk;

    &:not(.expanded) {
      display: none;
    }

    &.expanded {
      border-top: 1px solid @dandelion-milk;
      margin-top: 0.9rem;
      margin-bottom: -0.9rem;
    }
  }

}

</style>
