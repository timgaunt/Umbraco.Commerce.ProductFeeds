import { UmbElementMixin } from '@umbraco-cms/backoffice/element-api';
import {
    customElement,
    html,
    css,
    state,
    LitElement,
} from '@umbraco-cms/backoffice/external/lit';
import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import { UC_PRODUCT_FEEDS_WORKSPACE_CONTEXT } from './context.js';
import { UC_STORE_CONTEXT, UcStoreModel } from '@umbraco-commerce/backoffice';
import { WORKSPACE_COLLECTION_ALIAS } from '../constants.js';
import { UcProductFeedsCollectionConfiguration } from '../types.js';
import { storeRoute } from './fe-routes.js';

const elementName = 'uc-product-feeds-workspace-collection';
@customElement(elementName)
export class UcProductFeedsWorkspaceCollectionElement extends UmbElementMixin(LitElement) {
    #workspaceContext?: typeof UC_PRODUCT_FEEDS_WORKSPACE_CONTEXT.TYPE;

    @state()
    private _config?: UcProductFeedsCollectionConfiguration;

    @state()
    _store?: UcStoreModel;

    constructor() {
        super();

        this.consumeContext(UC_STORE_CONTEXT, (ctx) => {
            this.observe(ctx.store, (store) => {
                this._store = store;
                console.log('workspace element store', store);
                this.#constructConfig();
            });
        });

        this.consumeContext(UC_PRODUCT_FEEDS_WORKSPACE_CONTEXT, (ctx) => {
            this.#workspaceContext = ctx;
        });
    }

    #constructConfig() {
        if (!this._store) return;

        this._config = {
            // storeId: this._store.id,
            pageSize: 200, // Currently have to set a page size otherwise it doesn't load initial data
        };
    }

    render() {
        return this._config
            ? html`<umb-body-layout main-no-padding headline=${this.localize.term('ucProductFeeds_collectionLabel')}>
                  <umb-workspace-entity-action-menu
                      slot="action-menu"
                  ></umb-workspace-entity-action-menu>
                  <umb-collection
                      alias=${WORKSPACE_COLLECTION_ALIAS}
                      .config=${this._config}
                  ></umb-collection>
                  <div slot="footer-info" id="footer">
                      <a href=${storeRoute(this._store!.id)} >${this._store?.name}</a>
                      / ${this.localize.term('ucProductFeeds_collectionLabel')}
                  </div>
              </umb-body-layout>`
            : '';
    }

    static styles = [
        UmbTextStyles,
        css`
            :host {
                display: block;
                width: 100%;
                height: 100%;
            }

            #footer {
                padding: 0 var(--uui-size-layout-1);
            }
        `,
    ];
}

export default UcProductFeedsWorkspaceCollectionElement;

declare global {
    interface HTMLElementTagNameMap {
        [elementName]: UcProductFeedsWorkspaceCollectionElement;
    }
}
